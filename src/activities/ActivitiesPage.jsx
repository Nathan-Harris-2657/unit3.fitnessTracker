import { useState } from "react";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import { useAuth } from "../auth/AuthContext";

export default function ActivitiesPage() {
  const { token } = useAuth();
  const { data: activities, loading, error } = useQuery("/activities", "activities");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: createActivity, error: createError } = useMutation("POST", "/activities", ["activities"]);
  const { mutate: deleteActivity, error: deleteError } = useMutation("DELETE", null, ["activities"]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createActivity({ name, description });
    setName("");
    setDescription("");
  };

  const handleDelete = async (activityId) => {
    await deleteActivity({}, `/activities/${activityId}`);
  };

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h1>Activities</h1>

      {token && (
        <form onSubmit={handleCreate}>
          <h2>Create New Activity</h2>
          <label>
            Name:
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Description:
            <input value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>
          <button type="submit">Add Activity</button>
          {createError && <p>Error: {createError}</p>}
        </form>
      )}

      <ul>
        {activities?.map((activity) => (
          <li key={activity.id}>
            <h2>{activity.name}</h2>
            <p>{activity.description}</p>
            {token && (
              <button onClick={() => handleDelete(activity.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>

      {deleteError && <p>Error deleting activity: {deleteError}</p>}
    </>
  );
}


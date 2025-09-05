import React from "react";

export default function EditPost({
  editData,
  handleEditChange,
  handleUpdatePost,
  handleCancel,
  editLoading,
}) {
  return (
    <div className="edit-post-container">
      <h2>Edit Post</h2>
      <form onSubmit={handleUpdatePost}>
        <input
          name="title"
          value={editData.title}
          onChange={handleEditChange}
          required
        />
        <textarea
          name="content"
          value={editData.content}
          onChange={handleEditChange}
          required
        />
        <button type="submit" disabled={editLoading}>
          {editLoading ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

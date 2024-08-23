import React, { useState } from "react";
import { Input, Textarea, Link } from "@nextui-org/react";
import axios from "axios";
import useToken from "@/hooks/useToken"; // Adjust the import path as necessary
import { BACKEND_URL } from "@/lib/config";

const CreateProject: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { userId } = useToken(); // Get userId using the useToken hook
  const [projectId, setProjectId] = useState("");
  const [error, setError] = useState("");

  const handleCreateProject = async () => {
    // Check if the title is blank
    if (!title) {
      setError("Please title your project.");
      return;
    }

    try {
      // Log the title, description, and userId for debugging
      console.log("Title:", title);
      console.log("Description:", description);
      console.log("User ID:", userId);
      
      // Make a POST request to create a new project
      const response = await axios.post(`${BACKEND_URL}/project/create`, {
        title: title,
        description: description,
        created_user_id: userId, // Use the userId from the useToken hook
      });
      
      // Log the response for debugging
      console.log(response.data);
      setProjectId(response.data.project_id);
      window.location.href = `/console/${response.data.project_id}`; // Redirect to the new project page
    } catch (error) {
      // Log the error for debugging
      console.error("Error creating project:", error);
  
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="VStack gap-5 w-full h-full">
      <p className="font-medium text-xl">Create New Project</p>
      <form className="VStack gap-5">
        <Input
          isRequired
          type="text"
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(""); // Clear error message when user starts typing
          }}
        />
        <Textarea
          label="Description"
          placeholder="Enter your description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

        <div className="HStack justify-between">
          <Link href="#" className="text-sm text-primary-dark dark:text-primary opacity-75">
            Cancel
          </Link>
          <button
            type="button"
            className="dark:bg-tertiary-dark bg-tertiary pt-2 pb-2 pl-4 pr-4 rounded-lg text-sm text-primary-dark dark:text-primary"
            onClick={handleCreateProject}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;

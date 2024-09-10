import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { SlOptionsVertical } from "react-icons/sl";
import Link from "next/link";
import useToken from "@/hooks/useToken";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/lib/config";

type Project = {
  id: string;
  title: string;
  // Add any other properties your project object has
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { userId } = useToken();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/project/get_dev_project?created_user_id=${userId}`
        );
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [userId]);

  const LinkProject = (project: Project) => {
    return (
      <Link href={`/console/${project.id}`}>
        <div className="VStack p-4 pb-5 h-full w-full justify-end">
          <p className="font-medium text-xl">{project.title}</p>
        </div>
      </Link>
    );
  }

  return (
    <>
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-primary dark:bg-primary-dark w-[250px] h-[250px] p-5 hover:bg-opacity-25 rounded-lg shadow-sm aspect-square"
        >
         

          {LinkProject(project)}

        </div>
      ))}
    </>
  );
};

export default Projects;

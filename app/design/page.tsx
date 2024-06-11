import React from "react";
import { Image, Link } from "@nextui-org/react";
import { GoArrowUpRight } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col justify-between w-10/12  lg:w-8/12 ">
      <section className="gap-5  VStack   w-full h-full mt-12">
        <p className="text-3xl font-medium ">Human Interface Guildelines</p>
        <p className="opacity-70 w-3/4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis
          harum sunt minima voluptatum magnam temporibus repellat quos culpa
          tempora? Optio accusamus nisi quis, ratione vel quod. Officia facere
          numquam cupiditate?
        </p>
        <div className="HStack gap-1">
          <Link
            href="https://www.figma.com/design/aS9szZuIVjnU1aBNTlfM4J/FacePass-Resources?node-id=0%3A1&t=6naRtFwR86cAHTwH-1"
            target="_blank"
          >
            Resources
          </Link>
          <GoArrowUpRight className="text-blue-600 text-xs align-super" />
        </div>
        <div className="w-full h-full gap-5 VStack lg:items-center">
          <div className=" HStack  h-full rounded-lg w-full  shadow-sm">
            <Image
              src="images/design.jpg"
              className=" rounded-lg min-h-[250px] md:rounded-3xl w-full object-cover"
              alt=""
            />
          </div>

          <section className="cursor-pointer w-full items-center VStack">
            <Link
              href="https://www.figma.com/design/aS9szZuIVjnU1aBNTlfM4J/FacePass-Resources?node-id=0%3A1&t=6naRtFwR86cAHTwH-1"
              target="_blank"
              className="lg:pl-16  items-center lg:pr-16 lg:pt-4 lg:pb-4 pt-2 pb-2 justify-center pl-4 pr-4 bg-black shadow-sm bg-opacity-100 rounded-full HStack gap-1 text-white hover:bg-opacity-75"
              >
              <p> All Design Resources</p>{" "}
              <GoChevronRight className="text-white text-xl" />
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}

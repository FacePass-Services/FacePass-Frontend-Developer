"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import useToken from "@/hooks/useToken";
import { GoChevronDown } from "react-icons/go";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout, username } = useToken();
  const [clientSide, setClientSide] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setClientSide(true);
  }, []);

  return (
    <Navbar
      className={isScrolled || isMenuOpen ? "" : "bg-transparent"}
      maxWidth="2xl"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify="start">
        <Link
          href="/"
          className="font-semibold cursor-pointer text-2xl dark:text-white text-black"
        >
          FP Developer
        </Link>
        <NavbarContent className="hidden sm:flex gap-7 HStack items-center justify-center">
          <NavbarItem>
            <Link color="foreground" href="/documentation">
              Documentation
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/components" color="foreground">
              Components
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/design">
              Design
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/support">
              Support
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      {clientSide && isLoggedIn ? (
        <NavbarContent justify="end" className="HStack gap-5">
          {isMenuOpen ? (
            <NavbarItem></NavbarItem>
          ) : (
            <NavbarItem>
              <Button
                as={Link}
                className="justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-2 pt-2 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-3 lg:dark:bg-zinc-800/30"
                href="/console"
                variant="flat"
              >
                Console
              </Button>
            </NavbarItem>
          )}

          <NavbarItem className="hidden lg:flex">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex cursor-pointer items-center gap-3">
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    name="Jason Hughes"
                    size="sm"
                    src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                  />
                  {username}
                  <GoChevronDown />
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="settings" href="/profile">
                  Profile
                </DropdownItem>
                <DropdownItem key="team_settings" href="/settings">
                  Settings
                </DropdownItem>

                <DropdownItem key="help_and_feedback" href="/support">
                  Report
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={logout}>
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          {clientSide && (
            <>
              <NavbarItem className="hidden lg:flex">
                <Link
                  href="/sign-in"
                  className="text-black dark:text-white hover:opacity-75"
                >
                  Sign In
                </Link>
              </NavbarItem>
              {isMenuOpen ? (
                <NavbarItem></NavbarItem>
              ) : (
                <NavbarItem className="cursor-pointer">
                  <Button
                    as={Link}
                    className="justify-center border-b border-gray-300 cursor-pointer bg-gradient-to-b from-zinc-200 pb-2 pt-2 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-3 lg:dark:bg-zinc-800/30"
                    href="/sign-up"
                    variant="flat"
                  >
                    Sign Up
                  </Button>
                </NavbarItem>
              )}
            </>
          )}
        </NavbarContent>
      )}

      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarMenu className="">
        <NavbarMenuItem>
          <Link
            className="w-full text-black dark:text-white"
            size="lg"
            href="/documentation"
          >
            Documentation
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-black dark:text-white"
            size="lg"
            href="/components"
          >
            Components{" "}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-black dark:text-white"
            size="lg"
            href="/design"
          >
            Design
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full text-black dark:text-white"
            size="lg"
            href="/support"
          >
            Support
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className="mt-10">
          <Link
            className="w-full text-black dark:text-white opacity-50 cursor-not-allowed"
            size="sm"
          >
            FacePass Account
          </Link>
        </NavbarMenuItem>

        {isLoggedIn ? (
          <>
            <NavbarMenuItem>
              <Link
                className="w-full text-black dark:text-white"
                size="lg"
                href="/profile"
              >
                My profile
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="w-full text-black dark:text-white"
                size="lg"
                href="/settings"
              >
                Settings
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="w-full text-black dark:text-white"
                color="danger"
                size="lg"
                href="/"
                onClick={logout}
              >
                Sign Out
              </Link>
            </NavbarMenuItem>
          </>
        ) : (
          <>
            <NavbarItem className=" cursor-pointer">
              <Link href="/sign-in" className="text-black dark:text-white">
                Sign In
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
}

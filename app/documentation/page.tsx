"use client";
import React, { useState, useRef, useEffect } from "react";
import SideNavigation from "@/components/documentation/SideNavigation";
import { Code } from "@nextui-org/code";
import { Snippet } from "@nextui-org/snippet";
import ShortCut from "@/components/documentation/ShortCut";

export default function App() {
  const [selectedItem, setSelectedItem] = useState<string | null>(
    "background"
  );
  const [activeShortcut, setActiveShortcut] = useState<string | null>("background"); // Set the default activeShortcut to "npm"
  const installationRef = useRef<HTMLDivElement>(null);
  const npmRef = useRef<HTMLDivElement>(null);
  const cdnRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>,
    item: string
  ) => {
    setActiveShortcut(item);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getItemClassNames = (item: string) => {
    const isActive = activeShortcut === item;
    return `pl-3 pr-3 pt-2 pb-2 rounded-md cursor-pointer ${
      isActive ? "opacity-100" : "opacity-25"
    }`;
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "background":
        return (
          <section className="HStack w-full">
            <div className="VStack w-full gap-10">
              <div ref={installationRef} className="gap-3 VStack">
                <p className="text-4xl font-medium">Background</p>
                <p className="opacity-45">
                  There are few ways to import FacePass into your project
                </p>
              </div>
              <div className="HSection-break dark:bg-white"></div>

              <div className="text-justify gap-10 VStack">
                <p>
                  Since the inception of computing systems, security and
                  confidentiality have been crucial concerns since the inception
                  of computing systems. Early systems, like the Compatible
                  Time-Sharing System (CTSS) in the 1960s, introduced basic
                  password-based authentication for securing shared resources,
                  but vulnerabilities were evident. Innovations such as Robert
                  Morris&apos;s cryptographic hash functions in the 1970s greatly
                  improved password security[1]. This marked a pivotal moment in
                  authentication evolution, making password hashing a standard
                  practice across operating systems and platforms. Advancements
                  in cryptography and security protocols during the 1980s and
                  1990s further refined authentication mechanisms, leading to
                  the adoption of more sophisticated methods.
                </p>
                <p>
                  In today&apos;s digital landscape, most website interactions
                  necessitate authentication. Whether logging into social media
                  platforms, accessing online banking services, or making
                  purchases on e- commerce sites. With the rise of IoT devices,
                  authentication extends beyond websites to ensure only
                  authorised users access connected devices like smart home
                  appliances, smart electronic bins, and public devices. Users
                  are consistently prompted to verify their identities before
                  gaining access to various online resources. Began to
                  incorporate features such as user accounts, personalized
                  content, and secure transactions, necessitating reliable
                  methods of verifying user identities. Thus, authentication
                  mechanisms were introduced to ensure that only authorized
                  individuals could access sensitive information, perform
                  actions, and interact with online services securely.
                </p>
                <p>
                  In today&apos;s digital landscape, various authentication methods
                  are employed by websites to verify user identities. One of the
                  most common methods is the use of email addresses or usernames
                  paired with passwords. This traditional approach requires
                  users to input a unique combination of credentials to access
                  their accounts.
                </p>
                <p>
                  Another prevalent authentication method used on many websites
                  is Single Sign-On (SSO), which allows users to log in to
                  multiple websites or services using a single set of
                  credentials. Platforms like &quot;Sign in with Google&quot; or &quot;Sign in
                  with Facebook&quot; leverage SSO functionality, enabling users to
                  authenticate themselves quickly and conveniently without the
                  need to create new accounts or remember additional passwords.
                  While SSO offers convenience, it also raises concerns about
                  data privacy and security, as users may grant access to their
                  personal information across multiple platforms. This
                  increasing reliance on authentication also raises concerns
                  about transparency and user tracking. The issue of
                  transparency regarding data usage and tracking has also come
                  to the forefront. With the proliferation of data-driven
                  business models, users are increasingly aware of the potential
                  for their online activities to be monitored and their data to
                  be utilized for various purposes, including targeted
                  advertising and behavioral analytics.
                </p>
                <p>
                  As a result, individuals now manage an average of twenty-five
                  online accounts, yet only half of users maintain distinct
                  passwords for each account [1]. This practice poses a
                  significant security risk, as the compromise of a single
                  password can lead to unauthorized access across multiple
                  accounts. Moreover, the necessity for complex and unique
                  passwords, while enhancing security, often results in poor
                  password hygiene and increased vulnerability to cyber threats.
                </p>
                <p>
                  Traditional authentication methods, such as email and password
                  combinations, are increasingly viewed as vulnerable and
                  inconvenient. Email accounts are susceptible to compromise
                  through phishing attacks, while passwords are at risk of theft
                  through data breaches and malware. Additionally, the burden of
                  managing numerous complex passwords contributes to password
                  fatigue among users.
                </p>
                <p>
                  Furthermore, the rise of authentication services like &quot;Sign in
                  with Google&quot; exacerbates the risks associated with compromised
                  credentials. If a user&apos;s email and password are leaked or
                  stolen, access to all platforms linked to that email address,
                  including those utilising the &quot;Sign in with Google&quot; feature,
                  becomes vulnerable. This interconnectedness amplifies the
                  consequences of a security breach, potentially granting
                  unauthorized access to a myriad of online accounts and
                  sensitive information.
                </p>
                <p>
                  With the widespread integration of cameras into everyday
                  devices like smartphones, laptops, and tablets, and the
                  increased use of video conferencing platforms due to the
                  COVID-19 pandemic, webcams have become commonplace. This
                  ubiquity presents an opportunity for the development of more
                  secure and convenient authentication methods leveraging these
                  widely available camera-equipped devices.
                </p>
                <p>
                  In response to these challenges, among the various
                  authentication methods available, biometric authentication one
                  such method is biometric authentication —particularly facial
                  recognition—stands out as a viable option leveraging this
                  ubiquitous feature. Facial recognition offers seamless and
                  secure identity verification without additional equipment or
                  complex setup processes [6]. This practical and accessible
                  method addresses security concerns by utilizing unique facial
                  biometrics, significantly reducing unauthorized access risks
                  compared to passwords. Non-transferable facial biometrics
                  further ensure individual authentication, reducing credential
                  sharing risks [8]. Overall, facial authentication blends
                  security, convenience, and efficiency, making it a preferred
                  choice across digital platforms [9].
                </p>
                <p>
                  Introducing BionicID – our innovative solution poised to
                  revolutionize the authentication landscape. BionicID leverages
                  cutting-edge facial recognition technology to provide a secure
                  and seamless authentication experience. By offering developers
                  API services, BionicID empowers them to integrate secure and
                  convenient login options into their applications effortlessly.
                  With BionicID, users can enjoy enhanced security and
                  convenience, navigating digital platforms with confidence and
                  ease.
                </p>
                <p>
                  Unlike traditional Single Sign-On (SSO) methods where a
                  compromised email and password can grant access to multiple
                  platforms, BionicID&apos;s facial authentication ensures that even
                  if credentials are stolen, access to other platforms is not
                  compromised.
                </p>
                <p>
                  Furthermore, BionicID goes beyond conventional authentication
                  methods by offering the option to hide users&apos; email addresses.
                  Through the generation of random email addresses for user
                  transactions, BionicID enhances transparency and privacy in
                  online interactions. In an era where users are increasingly
                  conscious of data tracking and its implications for targeted
                  advertising and behavioral analytics, this feature provides
                  users with greater control over their personal information.
                </p>

                <p>
                  Utilising facial authentication through BionicID not only
                  enhances security and convenience but also opens up creative
                  possibilities. With BionicID, users can personalize their
                  authentication experience by using their face as a unique
                  identifier, akin to a digital persona. By incorporating facial
                  authentication, BionicID empowers users to interact with
                  digital platforms in a manner that reflects their personality
                  and preferences.
                </p>
                <p>
                  In addition to traditional facial authentication, BionicID
                  offers a cutting-edge feature known as Proof of Location
                  Authentication. This innovative capability leverages facial
                  recognition technology along with geolocation data to verify a
                  user&apos;s presence at a specific location, offering a robust
                  solution for applications requiring location-based
                  authentication.
                </p>
                <p>
                  In conclusion, BionicID represents a paradigm shift in the
                  realm of authentication, offering a comprehensive solution
                  that combines security, convenience, and personalization. With
                  features such as Single Sign-On with facial authentication,
                  private email addresses, and innovative add-ons like Persona
                  Gesturing and Proof of Location Authentication, BionicID
                  empowers both developers and users to navigate the digital
                  landscape with confidence and ease. By leveraging cutting-edge
                  facial recognition technology and prioritizing transparency
                  and privacy, BionicID sets a new standard for authentication
                  in the modern era. Embrace the future of authentication with
                  BionicID and unlock a world of possibilities in digital
                  security and user experience.
                </p>
              </div>
            </div>
          </section>
        );

      // Add more cases as needed for other items
      default:
        return <div>There is no information here!</div>;
    }
  };

  useEffect(() => {
    // Set the activeShortcut to "npm" when the component mounts
    setActiveShortcut("npm");
  }, []);

  return (
    <main className="VStack h-full items-center md:w-10/12 pt-12 md:pt-0 w-10/12 gap-5 min-h-screen">
      <section className="w-full h-full md:HStack VStack">
        <section className="w-full border-b-2 border-black dark:border-white dark:border-opacity-25 border-opacity-25 mb-10 md:mb-0 md:border-0 md:w-2/12 h-full md:sticky top-0">
          <SideNavigation setSelectedItem={setSelectedItem} />
        </section>
        <section className="w-full md:w-8/12 h-full pb-10 p-4">{renderContent()}</section>
        <section className="hidden md:block w-2/12 h-full sticky top-0">
          <ShortCut
            selectedItem={selectedItem}
            scrollToSection={scrollToSection}
            getItemClassNames={getItemClassNames}
            npmRef={npmRef}
            cdnRef={cdnRef}
          />
        </section>
      </section>
    </main>
  );
}

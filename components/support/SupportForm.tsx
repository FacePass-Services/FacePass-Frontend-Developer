import React, { useState } from "react";
import { Input, Textarea, Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";

const EmailForm: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("General");

  const handleMailto = () => {
    const mailtoString = `mailto:gramedit1.0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoString;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleMailto();
    // Reset form fields after submission
    setSubject("");
    setBody("");
    setSelectedTopic("General");
  };

  const titles = [
    { label: "General", value: "General" },
    { label: "Forget Account", value: "Forget" },
    { label: "Account Issues", value: "Account" },
    { label: "Lost Account", value: "Lost" },
    { label: "Don't receive Passcode", value: "Passcode" },
  ];

  return (
    <form onSubmit={handleSubmit} className="VStack gap-5 w-full">
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Select label="Select a topic" value={selectedTopic} onChange={(value) => setSelectedTopic(value)}>
          {titles.map((title) => (
            <SelectItem key={title.value} value={title.value}>
              {title.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input
          type="text"
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Textarea
          label="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <Button  type="submit">
        Send Email
      </Button>
    </form>
  );
};

export default EmailForm;

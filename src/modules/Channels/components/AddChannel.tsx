import React, { useState } from "react";
import { nanoid } from "nanoid";
import { IChannel } from "../../../types";

interface AddChannelProps {
  handleSubmit: (values: IChannel) => void;
}

export default function AddChannel({ handleSubmit }: AddChannelProps) {
  const [newChannelSubject, setNewChannelSubject] = useState<string>("");
  const [newChannelBody, setNewChannelBody] = useState<string>("");

  const submitChannel = async () => {
    if (!newChannelSubject.trim() || !newChannelBody.trim()) return;

    handleSubmit({
      subject: newChannelSubject,
      body: newChannelBody,
      id: nanoid(),
      createdAt: new Date(),
    });

    setNewChannelSubject("");
    setNewChannelBody("");
  };

  return (
    <div>
      <input
        value={newChannelSubject}
        onChange={(event) => setNewChannelSubject(event.target.value)}
        placeholder="enter channel subject"
      />
      <br />
      <textarea
        placeholder="enter channel body"
        value={newChannelBody}
        onChange={(event) => setNewChannelBody(event.target.value)}
      ></textarea>
      <br />
      <button onClick={submitChannel} className="w-10 bg-green-400">
        Create new channel
      </button>
    </div>
  );
}

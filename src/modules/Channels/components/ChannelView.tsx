import React, { useEffect, useState } from "react";
import {
  Firestore,
  query,
  orderBy,
  getDocs,
  collection,
  addDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { User } from "firebase/auth";
import { IChannel, IReplies } from "../../../types";

interface ChannelViewProps {
  db: Firestore | null;
  user: User | null;
  selectedChannel: IChannel;
  setSelectedChannel: (value: IChannel | null) => void;
}

export default function ChannelView({
  user,
  db,
  selectedChannel,
  setSelectedChannel,
}: ChannelViewProps) {
  const [repliesList, setRepliesList] = useState<IReplies[]>([]);
  const [newReply, setNewReply] = useState<string>("");

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db as Firestore, "replies"),
        orderBy("createdAt")
      );
      const docs = await getDocs(q);

      let allReplies: IReplies[] = [];
      docs.forEach((item) => {
        const data = item.data();
        allReplies.push(data as IReplies);
      });

      setRepliesList(
        allReplies.filter(({ channelId }) => channelId === selectedChannel.id)
      );
    })();
  }, [db, selectedChannel.id, repliesList]); //

  const submitReply = async () => {
    if (!newReply.trim()) return;

    await addDoc(collection(db as Firestore, "replies"), {
      text: newReply,
      authorEmail: user?.email,
      authorImage: user?.photoURL,
      authorName: user?.displayName,
      channelId: selectedChannel.id,
      id: nanoid(),
      createdAt: new Date(),
    });

    setNewReply("");
  };

  return (
    <div
      style={{
        width: "100%",
        marginTop: 20,
        textAlign: "left",
      }}
    >
      <div
        style={{
          paddingLeft: 20,
        }}
      >
        <button onClick={() => setSelectedChannel(null)}>
          Back to channels
        </button>
        <h3>Channel id: {selectedChannel.id}</h3>
        <h4> Subject: {selectedChannel.subject}</h4>
        <p> Body: {selectedChannel.body}</p>
        <br />
        <br />
        <b>Replies</b>
        <hr />
        <br />
        <div>
          {repliesList.map(({ id, authorImage, authorName, text }) => (
            <div style={{ marginBottom: 20 }} key={id}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={authorImage}
                  alt="user"
                  style={{ borderRadius: "999px", width: 20, height: 20 }}
                />
                &nbsp;
                <p style={{ margin: 0, fontWeight: "bold" }}>{authorName}</p>
              </div>
              <p style={{ margin: 3, paddingLeft: 20 }}>{text}</p>
            </div>
          ))}
        </div>
        <br />
        <br />
        <input
          value={newReply}
          onChange={(event) => setNewReply(event.target.value)}
          placeholder="write reply"
        />
        <button onClick={submitReply}>Submit reply</button>
      </div>
    </div>
  );
}

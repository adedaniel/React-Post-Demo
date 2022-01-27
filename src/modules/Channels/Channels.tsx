import React, { useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  Firestore,
  query,
  getDocs,
  collection,
  addDoc,
} from "firebase/firestore";
import { IChannel } from "../../types";
import ChannelView from "./components/ChannelView";
import AddChannel from "./components/AddChannel";

interface ChannelsProps {
  user: User | null;
  db: Firestore | null;
}

export default function Channels({ user = null, db = null }: ChannelsProps) {
  const [channelList, setChannelList] = useState<IChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);

  useEffect(() => {
    (async () => {
      const q = query(collection(db as Firestore, "channels"));
      const docs = await getDocs(q);

      let allChannels: IChannel[] = [];
      docs.forEach((item) => {
        const data = item.data();
        allChannels.push(data as IChannel);
      });
      setChannelList(allChannels);
    })();
  }, [db, channelList]); //

  const submitAddChannel = async (values: Partial<IChannel>) => {
    await addDoc(collection(db as Firestore, "channels"), values);
  };

  if (selectedChannel) {
    return (
      <ChannelView
        db={db}
        user={user}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
      />
    );
  }

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
        <AddChannel handleSubmit={submitAddChannel} />

        <h4 style={{ marginTop: 12 }}>
          All channels (Click on a channel to view)
        </h4>
        <ul>
          {channelList.map((channel: IChannel) => (
            <li
              key={channel.id}
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setSelectedChannel(channel)}
            >
              Channel {channel.id}:{" "}
              <span style={{ fontWeight: "bold" }}>{channel.subject}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

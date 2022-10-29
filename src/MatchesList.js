import {
  query,
  collection,
  onSnapshot,
  where,
} from "firebase/firestore";
import React from "react";
import { db } from "./firebase";

export default function MatchesList(props) {
  // get matches that involve this user as user1 or user2
  const [matchesSet1, setMatchesSet1] = React.useState([]);
  const [matchesSet2, setMatchesSet2] = React.useState([]);

  React.useEffect(() => {
    onSnapshot(
      query(collection(db, "matches"), where("user1", "==", props.uid)),
      (snapshot) => {
        let matches = [];
        snapshot.docs.forEach((doc) => {
          matches.push({ ...doc.data(), id: doc.id });
        });
        setMatchesSet1(matches);
      }
    );
  }, [props.uid]);
  React.useEffect(() => {
    onSnapshot(
      query(collection(db, "matches"), where("user2", "==", props.uid)),
      (snapshot) => {
        let matches = [];
        snapshot.docs.forEach((doc) => {
          matches.push({ ...doc.data(), id: doc.id });
        });
        setMatchesSet2(matches);
      }
    );
  }, [props.uid]);

  let matches = matchesSet1.concat(matchesSet2);

  return (
    <div className="bg-white shadow-lg m-4 p-4 rounded">
      <h1 className="text-xl font-bold">Matches</h1>
      <ul>
        {matches.length > 0
          ? matches.map((match) => (
              <li key={match.id}>
                {(() => {
                  let otherMatchUserId =
                    match.user1 === props.uid ? match.user2 : match.user1;
                  let otherMatchUserData = props.allUsers
                    .filter((user) => {
                      return user.id === otherMatchUserId;
                    })[0]
                    .data();
                  return (
                    otherMatchUserData.name +
                    " (Phone Number: " +
                    otherMatchUserData.phoneNumber +
                    ")"
                  );
                })()}
              </li>
            ))
          : "You don't have any matches yet!"}
      </ul>
    </div>
  );
}

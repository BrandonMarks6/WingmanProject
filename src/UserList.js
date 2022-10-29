import {
  query,
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  where,
} from "firebase/firestore";
import React from "react";
import { db } from "./firebase";

export default function UserList(props) {
  const [users, setUsers] = React.useState([]);
  const [decisions, setDecisions] = React.useState([]);
  React.useEffect(() => {
    onSnapshot(query(collection(db, "users")), (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      setUsers(users);
    });
    onSnapshot(query(collection(db, "decisions")), (snapshot) => {
      const decisions = [];
      snapshot.forEach((doc) => {
        decisions.push({ ...doc.data(), id: doc.id });
      });
      setDecisions(decisions);
    });
  }, []);

  let handleMatchDecision = (decision, id, matchName) => {
    // add doc to firestore
    addDoc(collection(db, "decisions"), {
      primaryUser: props.uid,
      secondaryUser: id,
      decision: decision,
    });

    // check if there is an opposite match in the decisions collection
    if (decision === true) {
      getDocs(
        query(
          collection(db, "decisions"),
          where("primaryUser", "==", id),
          where("secondaryUser", "==", props.uid)
        )
      ).then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          // if there is, add a match to the matches collection
          addDoc(collection(db, "matches"), {
            user1: props.uid,
            user2: id,
          });
          alert(
            props.pairedUser.data().name + " and " + matchName + " are now matched!"
          );
          props.activateConfetti();
        }
      });
    }
  };

  // undecided users are users that you haven't either liked or ignored
  let undecidedUsers = users.filter((user) => {
    let decision = decisions.find(
      (decision) =>
        decision.primaryUser === props.uid && decision.secondaryUser === user.id
    );
    return !decision;
  });

  // remove yourself from the list of users
  undecidedUsers = undecidedUsers.filter((user) => user.id !== props.uid);

  let shownUser = undecidedUsers[0];
  return (
    <div>
      {/* <h1 className="text-2xl flex justify-center font-bold">Matching</h1> */}
      {shownUser ? (
        <div
          key={shownUser.id}
          className="shadow-lg my-4 w-96 bg-white rounded"
        >
          <p className="px-4 py-2 text-2xl text-white font-bold bg-blue-400 rounded-t">
            {shownUser.name}, {shownUser.age}
          </p>
          <p className="px-4 py-2 break-all">
            {shownUser.city}, {shownUser.state}
            <br />"{shownUser.bio}"
          </p>
          <div className="flex flex-row px-4">
            <button
              className="transition-all flex-1 bg-blue-400 text-white rounded-full p-2 m-2  hover:scale-110 active:bg-blue-500 active:scale-100"
              onClick={() => handleMatchDecision(true, shownUser.id, shownUser.name)}
            >
              Like
            </button>
            <button
              className="transition-all flex-1 bg-red-400 text-white rounded-full p-2 m-2 hover:scale-110 active:bg-red-500 active:scale-100"
              onClick={() => handleMatchDecision(false, shownUser.id, shownUser.name)}
            >
              Ignore
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center">No more users to match with!</p>
      )}
    </div>
  );
}

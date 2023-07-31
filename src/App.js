import "./App.css";
import { auth, db } from "./firebase.js";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import React from "react";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { collection, where, query, doc, getDoc } from "firebase/firestore";
import ProfileForm from "./ProfileForm";
import WingmanManager from "./WingmanManager";
import UserList from "./UserList";
import logo from "./logo.png";
import { onSnapshot } from "firebase/firestore";
import MatchesList from "./MatchesList";
import Confetti from 'react-dom-confetti';

const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => {
      // refresh page
      window.location.reload();
    },
  },
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userData: null,
      pairedUser: null,
      decisions: null,
      allUsers: null,
      confettiActive: false
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {

        // find wingman pairings where this user is the wingman
        onSnapshot(
          query(
            collection(db, "wingman_pairings"),
            where("wingman", "==", user.uid)
          ),
          (snapshot) => {
            if (snapshot.docs.length > 0) {
              // get the name of the user that this user is paired with
              getDoc(
                doc(db, "users", snapshot.docs[0].data().paired_user)
              ).then((doc) => {
                this.setState({ ...this.state, pairedUser: doc });
              });
            }
          }
        );

        getDoc(doc(db, "users", user.uid)).then((doc) => {
          this.setState({ ...this.state, userData: doc });
        });

        onSnapshot(
          query(
            collection(db, "users"),
          ),
          (snapshot) => {
            this.setState({ ...this.state, allUsers: snapshot.docs });
          }
        )

        this.setState({ ...this.state, user: user });
      } else {
        this.setState({ ...this.state, user: null });
      }
    });
  }

  render() {
    return (
      <div className="flex flex-col justify-center items-center bg-gradient-to-b from-pink-500 to-blue-500 min-h-screen">
       <Confetti active={ this.state.confettiActive } config={ confettiConfig }/>
        <img src={logo} className="w-48 mt-6 mb-0" alt="Wingman logo" />
        <div className="flex bg-white justify-center my-8 rounded-xl p-4 ">
          <div className="">
            {this.state.user ? (
              <>
                <div className="flex flex-col justify-center">
                  {this.state.pairedUser ? (
                    <>
                      <UserList uid={this.state.pairedUser.id} userData={this.state.userData} pairedUser={this.state.pairedUser} activateConfetti={(() => {this.setState({confettiActive: true})}).bind(this)}/>
                    </>
                  ) : (
                    <p className="text-center">You're not anyone's wingman yet.</p>
                  )}
                  <ProfileForm
                    uid={this.state.user.uid}
                    userData={this.state.userData}
                    email={this.state.user.email}
                    handleLogout={() => {
                      auth.signOut();
                      this.setState({ user: null });
                    }}
                  />
                  <WingmanManager
                    pairedUser={this.state.pairedUser}
                    uid={this.state.user.uid}
                  />
                  <MatchesList uid={this.state.user.uid} allUsers={this.state.allUsers}/>
                  {/* {
                    this.state.decisions ? (
                      this.state.decisions.map(
                        (decision) => {
                          return <div>
                            {decision.secondary_user} {decision.decision}
                            </div>
                        }
                      )
                    ) : null
                  } */}
                </div>
              </>
            ) : (
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

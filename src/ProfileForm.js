import { useFormik } from "formik";
import {
  query,
  collection,
  setDoc,
  doc,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
let ProfileForm = (props) => {
  let initialValues = {
    email: props.email,
    name: "",
    age: "",
    city: "",
    state: "",
    phoneNumber: "",
    bio: "",
  };
  
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      // ensure all values are set
      if (
        values.name === "" ||
        values.age === "" ||
        values.city === "" ||
        values.state === "" ||
        values.phoneNumber === "" ||
        values.bio === ""
      ) {
        alert("Please fill out all fields");
        return;
      }
      setDoc(doc(db, "users", props.uid), values);
    },
  });

  // use formik to get errors

  return (
    <div className="bg-white shadow-lg p-4 m-4 rounded">
      <h1 className="text-2xl text-center font-bold mb-4">
        Update Your Profile
      </h1>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
        <div className="font-bold gap-4 flex flex-row">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            disabled
            type="text"
            className="p-1 bg-gray-100 text-gray-500 rounded flex-1"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </div>
        <div className="font-bold gap-4 flex flex-row">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            className="p-1 border border-gray-300 rounded flex-1"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </div>
        <div className="font-bold gap-4 flex flex-row">
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            name="age"
            type="number"
            className="p-1 border border-gray-300 rounded flex-1"
            onChange={formik.handleChange}
            value={formik.values.age}
          />
        </div>
        <div className="font-bold gap-4 flex flex-row">
          <label htmlFor="city">City:</label>
          <input
            id="city"
            name="city"
            type="text"
            className="p-1 border border-gray-300 rounded flex-1"
            onChange={formik.handleChange}
            value={formik.values.city}
          />
        </div>
        <div className="font-bold gap-4 flex flex-row">
          <label htmlFor="state">State:</label>
          <input
            id="state"
            name="state"
            type="text"
            className="p-1 border border-gray-300 rounded flex-1"
            onChange={formik.handleChange}
            value={formik.values.state}
          />
        </div>
        <div className="font-bold gap-4 flex flex-row">
          <label htmlFor="phoneNumber">Phone #:</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            className="p-1 border border-gray-300 rounded flex-1"
            onChange={formik.handleChange}
            value={formik.values.phoneNumber}
          />
        </div>
        <div className="font-bold gap-4 flex flex-row">
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            onChange={formik.handleChange}
            value={formik.values.bio}
            maxLength={100}
            className="p-1 border border-gray-300 rounded font-medium flex-1"
          />
        </div>

        <div className="flex flex-row gap-2">
          <button
            type="submit"
            className="rounded-full p-1 bg-blue-400 shadow-lg  hover:scale-105 transition-all active:scale-100 active:bg-blue-500 text-white flex-1"
          >
            Update profile
          </button>
        </div>
        <div className="flex flex-row gap-2">
          <button
            className="rounded-full p-1 bg-red-400 shadow-lg  hover:scale-105 flex-1  active:bg-red-500 active:scale-100 text-white transition-all"
            onClick={() => {
              // Deletes all decisions from Firestore that match this UID
              let q = query(
                collection(db, "decisions"),
                where("primaryUser", "==", props.uid)
              );
              getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((decision) => {
                  deleteDoc(doc(db, "decisions", decision.id));
                });
              });

              // Deletes all matches from Firestore that match this UID
              q = query(
                collection(db, "matches"),
                where("user1", "==", props.uid)
              );
              getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((match) => {
                  deleteDoc(doc(db, "matches", match.id));
                });
              });
              q = query(
                collection(db, "matches"),
                where("user2", "==", props.uid)
              );
              getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((match) => {
                  deleteDoc(doc(db, "matches", match.id));
                });
              });
            }}
            type="button"
          >
            Reset my matches
          </button>

          <button
            className="rounded-full p-1 bg-red-400 shadow-lg  hover:scale-105 flex-1 active:bg-red-500 active:scale-100 text-white transition-all"
            onClick={props.handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};
export default ProfileForm;

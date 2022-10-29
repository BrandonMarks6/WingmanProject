import { useFormik } from "formik";
import {
  query,
  collection,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
let WingmanManager = (props) => {
  const formik = useFormik({
    initialValues: {
      email: props.email,
      name: "",
      age: "",
      city: "",
      state: "",
      phoneNumber: "",
      bio: "",
    },
    onSubmit: (values) => {
      getDocs(query(collection(db, "users"), where("email", "==", values.email)))
        .then((querySnapshot) => {
          if(querySnapshot.size === 0) {
            alert("No user with that email found");
            return;
          }else{
            console.log(
              props.uid,
              querySnapshot.docs[0].id
            )
            addDoc(collection(db, "wingman_pairings"), {
              paired_user: props.uid,
              wingman: querySnapshot.docs[0].id,
            }).then(
              alert("Wingman added!")
            );
          }
        }
        )
    },
  });

  return (
    <div className="bg-white shadow-lg p-4 m-4 rounded">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
        { props.pairedUser ? (
        <p>
          You're making matches on behalf of <span className="font-bold">{props.pairedUser.data().name}</span>
        </p>
        ) : (
          <p>
          You're not wingmanning for anyone.
        </p>
        )}

        
        <div className="font-bold gap-4 flex flex-row">
          <input
            id="email"
            name="email"
            type="text"
            className="p-1 border border-gray-300 rounded flex-1"
            placeholder="Wingman's email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </div>
       

        <div className="flex flex-row gap-2">
          <button
            type="submit"
            className="rounded-full p-1 bg-blue-400 shadow-lg  hover:scale-105 transition-all active:scale-100 active:bg-blue-500 text-white flex-1"
          >
            Invite wingman
          </button>
</div>
      </form>
    </div>
  );
};
export default WingmanManager;

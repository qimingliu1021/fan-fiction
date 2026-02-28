import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc,updateDoc, collection } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface AuthError {
  code: string;
  message: string;
}


export const signUp = async (
  email: string,
  password: string
): Promise<User | AuthError> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

               // 在 Firestore 中为用户创建文档
           await setDoc(doc(db, "users", user.uid), {
             email: user.email,
             createdAt: new Date(),
             lastLogin: new Date().toLocaleString('en-US', {
               year: 'numeric',
               month: '2-digit',
               day: '2-digit',
               hour: '2-digit',
               minute: '2-digit',
               second: '2-digit'
             }),
           });

    return user;
  } catch (error: any) {
    return {
      code: error.code,
      message: error.message,
    };
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<User | AuthError> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // 登录时更新 lastLogin
    await updateDoc(doc(db, "users", user.uid), {
      lastLogin: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
    });
    return user;
  } catch (error: any) {
    return {
      code: error.code,
      message: error.message,
    };
  }
};

export const signOut = async (): Promise<void | AuthError> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    return {
      code: error.code,
      message: error.message,
    };
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

import React, { useEffect } from "react";
import NavBar from "../components/layout/SideBar";
import { useDispatch, useSelector } from "react-redux";

const Home: React.FC = () => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //     dispatch({type: "GET_POSTS_REQUESTED"})
  // }, [dispatch])

  // const posts = useSelector((state: any) => state.postsReducer.posts);
  // console.log(posts);
  return <div>hello</div>;
};

export default Home;

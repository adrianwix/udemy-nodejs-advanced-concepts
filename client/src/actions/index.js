import axios from "axios";
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG } from "./types";

export const fetchUser = () => async dispatch => {
	const res = await axios
		.get("/api/current_user")
		.catch(err => console.log(err));

	dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
	const res = await axios
		.post("/api/stripe", token)
		.catch(err => console.log(err));

	dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, history) => async dispatch => {
	const res = await axios
		.post("/api/blogs", values)
		.catch(err => console.log(err));

	history.push("/blogs");
	dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const fetchBlogs = () => async dispatch => {
	const res = await axios.get("/api/blogs").catch(err => console.log(err));

	dispatch({ type: FETCH_BLOGS, payload: res.data });
};

export const fetchBlog = id => async dispatch => {
	const res = await axios
		.get(`/api/blogs/${id}`)
		.catch(err => console.log(err));

	dispatch({ type: FETCH_BLOG, payload: res.data });
};

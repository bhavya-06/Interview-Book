import React, { Component } from 'react';
import { singlePost, removePost, like, unlike } from './apiPost';
import DefaultPost from "../images/dummy-image.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from '../auth';
import ReactHtmlParser from 'react-html-parser';

class SinglePost extends Component {
    state = {
        post: "",
        redirectToHome: false,
        redirectToSignin: false,
        like: false,
        likes: 0
    };

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            }
            else {
                this.setState({
                    post: data,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes)
                });
            }
        })
    }

    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    }

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }

        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated() && isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            }
            else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                })
            }
        })

    }

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        removePost(postId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            }
            else {
                this.setState({ redirectToHome: true });
            }
        })
    }

    deleteConfirmed = () => {
        let answer = window.confirm("Are your sure you want to delete the post ?");
        if (answer) {
            this.deletePost();
        }
    };

    renderPost = (post) => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";

        const { like, likes } = this.state;

        return (
            <div className="card-body">

                <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.title}
                    onError={i =>
                        (i.target.src = `${DefaultPost}`)
                    }
                    className="img-thunbnail mb-3"
                    style={{ height: "150px", width: "auto" }}
                />

                {like ? (
                    <h3 onClick={this.likeToggle}>
                        <i
                            className="fa fa-thumbs-up text-success bg-dark"
                            style={{ padding: '10px', borderRadius: '50%' }}
                        />{' '}
                        {likes} Like
                    </h3>
                ) : (
                    <h3 onClick={this.likeToggle}>
                        <i
                            className="fa fa-thumbs-o-up text-warning bg-dark"
                            style={{ padding: '10px', borderRadius: '50%' }}
                        />{' '}
                        {likes} Like
                    </h3>
                )}

                <p className="card-text">
                    {ReactHtmlParser(post.body)}
                </p>
                <br />
                <p className="font-italic mark">
                    Posted by {" "}
                    <Link to={`${posterId}`}>
                        {posterName} {" "}
                    </Link>
                    on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">
                        <i class="fa fa-arrow-left" aria-hidden="true"></i> {" "}
                        Back to posts
                    </Link>

                    {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && (
                        <>
                            <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning btn-sm mr-5">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                {" "}
                                Update Post

                            </Link>

                            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
                                <i class="fa fa-trash-o fa-fw"></i> {" "}
                                Delete Post
                            </button>
                        </>
                    )}

                </div>
            </div>
        );
    }

    render() {
        const { post, redirectToHome, redirectToSignin } = this.state;

        if (redirectToHome) {
            return <Redirect to={"/"} />;
        }

        if (redirectToSignin) {
            return <Redirect to={"/signin"} />;
        }

        return (
            <div className="container">

                <h2 className="display-3 mt-5 mb-5">{post.title}</h2>

                {!post ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    this.renderPost(post)
                )}

            </div>
        )
    }
}

export default SinglePost;
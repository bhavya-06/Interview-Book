import React, { Component } from "react";
import { list } from "./apiPost";
import DefaultPost from "../images/dummy-image.jpg";
import { Link } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    }

    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, i) => {
                    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
                    const posterName = post.postedBy ? post.postedBy.name : " Unknown";

                    return (
                        <div className="card col-md-4" key={i}>
                            <div className="card-body">
                                <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                    alt={post.title}
                                    onError={i =>
                                        (i.target.src = `${DefaultPost}`)
                                    }
                                    className="img-thunbnail mb-3"
                                    style={{ height: "200px", width: "100%" }}
                                />
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">
                                    {post.body ? ReactHtmlParser(post.body.substring(0, 100)) : ""}
                                </p>
                                <br />
                                <p className="font-italic mark">
                                    Posted by {" "}
                                    <Link to={`${posterId}`}>
                                        {posterName} {" "}
                                    </Link>
                                    on {new Date(post.created).toDateString()}
                                </p>
                                <div className="inline-block">
                                    <Link
                                        to={`/post/${post._id}`}
                                        className="btn btn-raised btn-primary btn-sm"
                                    >
                                        Read more
                                    </Link>

                                    <b>
                                        <i
                                            className="fa fa-thumbs-up text-success bg-dark"
                                            style={{ padding: '10px', borderRadius: '50%' }}
                                        />{' '}
                                        {post.likes.length} Like
                                    </b>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const { posts } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">
                    {!posts.length ? "No more posts!" : "Recent Posts"}
                </h2>

                {this.renderPosts(posts)}

            </div>
        );
    }
}

export default Posts;

import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import ShowPost from '../helpers/ShowPost';
import axios from 'axios';
import './Home.css';
import './Form.css';

const FRIENDFEED = "http://localhost/mediashare/src/post-apis/feed.php";
const POPFEED = "http://localhost/mediashare/src/post-apis/popfeed.php";

function Feed({username, friends, incUser, incTitle, incSource, incCaption, search, newSearch}) {
    console.log(search);
    const [inputs, setInputs] = useState({
      name: username,
      friendFeed: friends,
      filtUser: incUser,
      filtTitle: incTitle,
      filtSource: incSource,
      filtCaption: incCaption,
      query: search,
      newQuery: newSearch,
      posts: []
    });

    // update search query when user clicks 'search'
    useEffect(() => {
      setInputs(values => ({...values, query: search}));
    }, [newSearch]);
    
    // update feed when user clicks 'friends/popular' OR when new search query added to inputs state
    useEffect(() => {
      updateFeed(inputs.query);
    }, [friends, inputs.query]);

    const updateFeed = (updateInfo) =>{
      console.log(updateInfo);
      if(friends){
        console.log(inputs.query);
        axios({
          method: "post",
          url: `${FRIENDFEED}`,
          headers: { "content-type": "application/json" },
          data: inputs
        })
        .then((result) => {
          const name = 'posts';
          const value = result.data;
          setInputs(values => ({...values, [name]: value}));
        })
        .catch((error) => {
          console.log(error);
        });
      } else {
        console.log(inputs.query);

        axios({
          method: "post",
          url: `${POPFEED}`,
          headers: { "content-type": "application/json" },
          data: inputs
        })
        .then((result) => {
          console.log(result.data);
          const name = 'posts';
          const value = result.data;
          setInputs(values => ({...values, [name]: value}));
        })
        .catch((error) => {
          console.log(error);
        });
      }
    }

    return (
      <section style={{width:'98%', margin: 'auto', padding:'0px'}}>
        {inputs.posts.map((post) =>
          <ShowPost key={post.id} {...post} />
        )}  
      </section>      
    );
}

export default Feed;
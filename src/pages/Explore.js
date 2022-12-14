import React, {useState, useEffect} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import Post from './Post';
import Feed from './Feed';
import Countdown from '../helpers/Countdown';
import './Home.css';
import './Form.css';
import '../helpers/Post.css'

const LAST_USER_POST = "http://youRL.site/youRLapi/user-apis/lastuserpost.php";

function Explore({user, isPosting}) {
  const [inputs, setInputs] = useState({
    name: user,
    link: '',
    posting: isPosting,
    friendFeed: false,
    lastPost: 0,
    newSearch: 0,
    lastSearch: ''
  });

  const [newPost, setPost] = useState({
    title: '',
    url: '',
    image: '',
    description: ''
  });

  const [filter, setFilters] = useState({
    friends: false,
    popular: true,
    user: true,
    userStr: 'user',
    source: true,
    sourceStr: 'source',
    title: true,
    titleStr: 'title',
    caption: true,
    captionStr: 'caption',
    query: ''
  });

  useEffect(() => {
    canUserPost();
  }, []);

  const canUserPost = () => {
    axios({
      method: "post",
      url: `${LAST_USER_POST}`,
      headers: { "content-type": "application/json" },
      data: inputs
    })
    .then((result) => {
      if(result.data !== true) {
        const curr = new Date();
        const year = curr.getFullYear();
        const month = curr.getMonth();
        const day = curr.getDate();
        const hour = curr.getHours();
        const mins = curr.getMinutes();

        const nextPostTime = new Date(year, month, day+1);
        const temp = new Date(result.data).getTime();
        const currTime = new Date(year, month, day, hour, mins).getTime();

        let diff = nextPostTime.getTimezoneOffset()*60*1000;
        let tempVal = temp - diff;

        if((nextPostTime - tempVal)/1000/60/60 < 24){
          const name = 'lastPost';
          const value = (nextPostTime - currTime)/1000/60;
          setInputs(values => ({...values, [name]: value}));
        } else {
          const name = 'lastPost';
          const value = 0;
          setInputs(values => ({...values, [name]: value}));
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const getLink = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const getPost = (data) => {
    const n1 = 'title';
    const v1 = data.title;
    setPost(values => ({...values, [n1]: v1}));
    const n2 = 'url';
    const v2 = data.url;
    setPost(values => ({...values, [n2]: v2}));
    const n3 = 'image';
    const v3 = data.image;
    setPost(values => ({...values, [n3]: v3}));
    const n4 = 'description';
    const v4 = data.description;
    setPost(values => ({...values, [n4]: v4}));
    const n5 = 'posting';
    const v5 = true;
    setInputs(values => ({...values, [n5]: v5}))
  }

  const PostHandler = (event)  => { 
    event.preventDefault();
    if(inputs.link.length < 1) return;
    axios.post(
      'https://api.linkpreview.net',
      `key=e676560b8697f0ace6eb14828475d882&q=${inputs.link}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).then(function (response) {
      getPost(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  const showPop = () => {
    setInputs(values => ({...values, friendFeed: false}));
    setFilters(values => ({...values, friends: false}));
    setFilters(values => ({...values, popular: true}));
  }
  const showFriend = () => {
    setInputs(values => ({...values, friendFeed: true}));
    setFilters(values => ({...values, friends: true}));
    setFilters(values => ({...values, popular: false}));
  }
  const getFilters = (event) => {
    event.preventDefault();
    const name = event.target.name;
    if(name === filter.userStr){
      if(filter.user === true){
        setFilters(values => ({...values, [name]: false}));
      } else {
        setFilters(values => ({...values, [name]: true}));
      }
    } else if(name === filter.sourceStr){
      if(filter.source === true){
        setFilters(values => ({...values, [name]: false}));
      } else {
        setFilters(values => ({...values, [name]: true}));
      }
    } else if(name === filter.titleStr){
      if(filter.title === true){
        setFilters(values => ({...values, [name]: false}));
      } else {
        setFilters(values => ({...values, [name]: true}));
      }
    } else {
      if(filter.caption === true){
        setFilters(values => ({...values, [name]: false}));
      } else {
        setFilters(values => ({...values, [name]: true}));
      }
    }
  }

  const searchHandler = (event) => {
    const value = event.target.value;
    setFilters(values => ({...values, query: value}));
  }

  const getSearch = (event) => {
    event.preventDefault();
    const numSearch = inputs.newSearch+1;
    setInputs(values => ({...values, newSearch: numSearch}));
    setInputs(values => ({...values, lastSearch: filter.query}));
  }

  if(!inputs.posting && inputs.lastPost < 5){
    return (
    <Row id='medrow'>
      <Col xs={4} id='yourstuff'>
        <Row style={{margin:'auto', height:'max-content', paddingBottom:'20px', borderBottom: '2px solid black'}}>
          <Container style={{margin:'0 auto', height:'min-content', padding:'0px'}}>
            <h4 id='youRFeedHeader'>youR Feed</h4>
            <Row style={{margin:'0 auto', paddingBottom:'10px'}}>
              <h5>
                <input name='friend' type='submit' value='Friends' id='friendsFeedBut' 
                  style={{ backgroundColor: filter.friends ? '#2297ff' : '#ff8903'}} onClick={showFriend}/>

                <input name='popular' type='submit' value='Popular' id='popularFeedBut' 
                style={{ backgroundColor: filter.popular ? '#2297ff' : '#ff8903'}} onClick={showPop}/>
              </h5>
              <Container style={{textAlign:'center', paddingLeft:'8px', paddingTop:'10px'}}>
                <h5>Search Feed:</h5>
                <form action='#'>
                  <input type='text' placeholder="search" value={filter.query || ""} 
                          id='searchInput' onChange={searchHandler}/>

                  <h6 style={{marginLeft: '10px', paddingTop:'10px', paddingBottom:'10px'}}>
                    Including:
                    <br/> 
                    <input type='submit' name='user' value='users' id='searchType'
                      style={{ backgroundColor: filter.user ? '#2297ff' : '#ff8903'}} onClick={getFilters}/>
                    <input type='submit' name='source' value='sources' id='searchType'
                      style={{ backgroundColor: filter.source ? '#2297ff' : '#ff8903'}} onClick={getFilters}/>
                    <input type='submit' name='title' value='titles' id='searchType' 
                    style={{ backgroundColor: filter.title ? '#2297ff' : '#ff8903'}} onClick={getFilters}/>
                    <input type='submit' name='caption' value='captions' id='searchType'
                    style={{ backgroundColor: filter.caption ? '#2297ff' : '#ff8903'}} onClick={getFilters}/>
                  </h6>

                  <input style={{marginLeft: '7px', fontWeight:'500'}} type="submit" value="Search" id='postBut' onClick={getSearch} />

                </form>
              </Container>
            </Row>
          </Container>
        </Row>
        <Row id='submitLinkRow'>
          <h4 id='youRFeedHeader'>Upload youRL</h4>
          <form  action="#" style={{padding: '5px', height: 'min-content'}}>
            <h6 style={{paddingTop: '20px', paddingBottom: '10px', paddingRight:'5px'}}>
              <input
                type="text"
                id="postInput"
                name="link"
                placeholder="your link"
                value={inputs.link || ""}
                onChange={getLink}
              />
            </h6>
            <input style={{marginLeft: '7px'}} type="submit" value="Next" id='postBut' onClick={PostHandler} />
          </form>
        </Row>
      </Col>
      <Col xs={8} id='middlecol'>                    
        <Container id='explorecontainer'>
          <Row id='explorerow'>
            <Feed username={inputs.name} friends={inputs.friendFeed} 
                incUser={filter.user} incTitle={filter.title} 
                incSource={filter.source} incCaption={filter.caption}
                search={inputs.lastSearch} newSearch={inputs.newSearch}/>
          </Row>
        </Container>
      </Col>
    </Row>
    );
  } else if (inputs.lastPost>5){
    return (
      <Countdown lastTime={inputs.lastPost} username={inputs.name} />
    );
  }else if(inputs.posting) {
    return (      
      <Post username={inputs.name} preview={newPost}/>
    );  
  }
}

export default Explore;
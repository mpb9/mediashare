import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import './Post.css';
import '../pages/Profile.css'

const PUBLIC_PROFILE = "http://youRL.site/youRLapi/user-apis/publicprofile.php";
const FOLLOW = "http://youRL.site/youRLapi/user-apis/follows.php";
const ALTER_FOLLOW = "http://youRL.site/youRLapi/user-apis/alterfollow.php";
const LIKE = "http://youRL.site/youRLapi/post-apis/like.php";
const COMMENT = "http://youRL.site/youRLapi/post-apis/comment.php";
const ADD_COMMENT = "http://youRL.site/youRLapi/post-apis/addcomment.php";
const COMMENTER_PROFILE = "http://youRL.site/youRLapi/user-apis/commenterprofile.php";

function ShowPost({id, viewer, poster, title, url, img, likes, comments, caption, date}) {
  
  const [posterProfile, setPosterProfile] = useState({
    user: viewer,
    name: poster,
    postid: id,
    show: false,
    follows: 'follow',
    showComments: false,
    commentPage: [],
    likeCount: likes,
    comCount: comments,
    newComment: '',
    proPic: '',
    commenter: '',
    data: []
  });

  useEffect(() => {
    if(posterProfile.commenter !== ''){
      getCommenterProfile();
    }
  }, [posterProfile.likeCount, posterProfile.comCount, posterProfile.commenter]);

  const getProfile = (event) => {
    event.preventDefault();
    axios({
      method: "post",
      url: `${PUBLIC_PROFILE}`,
      headers: { "content-type": "application/json" },
      data: posterProfile
    })
    .then((result) => {
      setPosterProfile(values => ({...values, data: result.data}));
      setPosterProfile(values => ({...values, show: true}));
      setPosterProfile(values => ({...values, proPic: result.data.proimg}));

      axios({
        method: "post",
        url: `${FOLLOW}`,
        headers: { "content-type": "application/json" },
        data: posterProfile
      })
      .then((result) => {
        setPosterProfile(values => ({...values, follows: result.data}));
      })
      .catch((error) => {
        console.log(error);
      });

    })
    .catch((error) => {
      console.log(error);
    });
  }

  const loadCommenterProfile = (event) => {
    event.preventDefault();
    if(event.target.value !== 'No comments yet!' && event.target.value !== 'anonymous'){
      setPosterProfile(values => ({...values, commenter: event.target.value}));
    }
  }
  const getCommenterProfile = () => {
    axios({
      method: "post",
      url: `${COMMENTER_PROFILE}`,
      headers: { "content-type": "application/json" },
      data: posterProfile
    })
    .then((result) => {
      setPosterProfile(values => ({...values, data: result.data}));
      setPosterProfile(values => ({...values, show: true}));
      setPosterProfile(values => ({...values, proPic: result.data.proimg}));

      axios({
        method: "post",
        url: `${FOLLOW}`,
        headers: { "content-type": "application/json" },
        data: posterProfile
      })
      .then((result) => {
        setPosterProfile(values => ({...values, follows: result.data}));
      })
      .catch((error) => {
        console.log(error);
      });

    })
    .catch((error) => {
      console.log(error);
    });
  }

  const followHandler = (event) => {
    event.preventDefault();
    axios({
      method: "post",
      url: `${ALTER_FOLLOW}`,
      headers: { "content-type": "application/json" },
      data: posterProfile
    })
    .then((result) => {
      setPosterProfile(values => ({...values, follows: result.data}));
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const likeHandler = (event) => {
    event.preventDefault();
    
    axios({
      method: "post",
      url: `${LIKE}`,
      headers: { "content-type": "application/json" },
      data: posterProfile
    })
    .then((result) => {
      if(result.data) {
        const liked = parseInt(posterProfile.likeCount)+1;
        setPosterProfile(values => ({...values, likeCount: liked}));
      } else {
        const liked = parseInt(posterProfile.likeCount)-1;
        setPosterProfile(values => ({...values, likeCount: liked}));
      }
    })
    .catch((error) => {
      console.log(error);
    });
    
  }
  
  const commentPage = (event) => {
    event.preventDefault();
    axios({
      method: "post",
      url: `${COMMENT}`,
      headers: { "content-type": "application/json" },
      data: posterProfile
    })
    .then((result) => {
      setPosterProfile(values => ({...values, commentPage: result.data}));
      setPosterProfile(values => ({...values, showComments: true}));
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const noComments = (event)=>{
    event.preventDefault();
    setPosterProfile(values => ({...values, showComments: false}));
  }

  const getFeed = (event) => {
    event.preventDefault();
    setPosterProfile(values => ({...values, show: false}));
    setPosterProfile(values => ({...values, commenter: ''}));
  }

  const handleComment = (event) => {
    const value = event.target.value;
    setPosterProfile(values => ({...values, newComment: value}))
  }

  const addComment = (event) => {
    event.preventDefault();
    axios({
      method: "post",
      url: `${ADD_COMMENT}`,
      headers: { "content-type": "application/json" },
      data: posterProfile
    })
    .then((result) => {
      let commented = parseInt(posterProfile.comCount)+1;
      if(posterProfile.newComment === ""){
        commented = parseInt(posterProfile.comCount);
      } 

      setPosterProfile(values => ({...values, comCount: commented}));
      setPosterProfile(values => ({...values, newComment: ''}));

      axios({
        method: "post",
        url: `${COMMENT}`,
        headers: { "content-type": "application/json" },
        data: posterProfile
      })
      .then((result) => {
        setPosterProfile(values => ({...values, commentPage: result.data}));
      })
      .catch((error) => {
        console.log(error);
      });

    })
    .catch((error) => {
      console.log(error);
    });
  }
  

  if(posterProfile.show){
    return(
      <Container id='profCont'>     
        <Row style={{margin: 'auto'}}>
          <Col xs={7} style={{padding: '2px',  paddingLeft: '7px', paddingRight: '7px', margin: '0 auto'}}>
            <Row style={{margin: 'auto', textAlign: 'left'}}>
              <input type='submit' value='Go Back' id='openlink' style={{ borderRadius: '4px'}} onClick={getFeed}/>
            </Row>
            <Row style={{margin: 'auto', height:'fit-content', backgroundColor:'#e497ff', borderRadius:'3px'}}>
              <Row style={{margin: 'auto', height:'40%', padding: '0px'}}>
                <Col xs={5} style={{margin: 'auto', paddingLeft: '8px', paddingRight: '0px', textAlign: 'left'}}>
                  <img id='pubProPic' src={posterProfile.proPic} alt=""/>
                  <input type='submit' value={posterProfile.follows} id='followBut' 
                   style={{display: posterProfile.user === posterProfile.data.username ? 'none' : 'inline'}}onClick={followHandler}/>
                </Col>
                <Col xs={7} style={{ padding: '4px', margin: 'auto'}}>
                  <h6 style={{paddingTop:'0px', marginBottom: '0px', fontSize: '110%'}}>{posterProfile.data.fullname}</h6>
                  <h6 style={{paddingTop:'0px', fontSize:'90%'}}>{posterProfile.data.username}</h6> 
                </Col>
              </Row>
              <Row style={{margin: 'auto', height:'60%'}}>
                  <Row style={{ textAlign: 'left', marginBottom:'0px', marginTop:'5px', height:'100%'}}>
                    <p>{posterProfile.data.bio}</p>
                  </Row>
              </Row>
            </Row>
          </Col>
          <Col xs={5} style={{ margin: '0 auto', paddingRight: '7px',  padding: '2px'}}>
            <h6>{posterProfile.data.date} <Button id='pubLink' onClick={() => window.open(url)}>Link</Button></h6>
            
              <img id='postImg' src={posterProfile.data.img} alt="Couldn't Generate"/>
              <h6 style={{paddingTop:'5px'}}>{posterProfile.data.title}</h6>  
              <p id='pubProCaption'>
                {posterProfile.data.caption}
              </p>
          </Col>
        </Row>
      </Container>
    );
  } else if(posterProfile.showComments){
    return(
      <Container id='postCont'>     
         <Row id='days'>
          <h6 style={{padding:'0px', marginBottom:'1px', color:'black', fontWeight:'bold'}}>{date}</h6>
        </Row>   
        <Row style={{margin: 'auto'}}>
        <Col xs={5} style={{textAlign: 'center', margin: 'auto', paddingTop: '5px'}}>
            <img id='postImg' src={img} alt="Couldn't Generate"/>
            <h5 style={{paddingTop:'5px'}}>{title}</h5>  
            <Button id='openlink' onClick={() => window.open(url)}>Open Link</Button>
          </Col>
          <Col xs={7} style={{ margin: 'auto', textAlign: 'left', paddingTop:'5px'}}>
            <p id='caption'>
              <input className='usernameLink' type='submit' value={poster} id='userLink' onClick={getProfile}/>
              {caption}
            </p>
            <Button id='link' onClick={likeHandler}>{posterProfile.likeCount} Likes</Button>
            <Button id='link' onClick={noComments}>Hide Comments</Button>
          </Col>
        </Row>
        <Row style={{margin: '0 auto', paddingTop: '2px'}}>
          <section style={{width:'100%', margin: '0 auto', padding:'0px'}}>
            {(posterProfile.commentPage).map((coms) =>
              <Col key={coms.id} style={{ margin: '5px', textAlign: 'left'}}>
                  <p id='comments'>
                    <input className='usernameLink' type='submit' value={coms.commenter} id='userLink' onClick={loadCommenterProfile}/>
                    {coms.comment}
                  </p>
              </Col>
            )}  
          </section>  
        </Row>
        <Row style={{margin:'0 auto', padding:'10px'}}>
          <form action='#'style={{margin:'0 auto', padding:'0px'}} >
            <textarea id='commentInput' type='text' placeholder="comment" maxLength="200" value={posterProfile.newComment || ""} onChange={handleComment} />
            <br/>
            <input id='commentBut' style={{margin: 'auto'}} type="submit" value="Comment" onClick={addComment} />
          </form>
        </Row>
      </Container>
    );
  } else {
    return (
    <Container id='postCont'>     
      <Row id='days'>
         <h6 style={{padding:'0px', marginBottom:'1px', color:'black', fontWeight:'bold'}}>{date}</h6>
      </Row>  
      <Row style={{margin: 'auto'}}>
        <Col xs={5} style={{textAlign: 'center', margin: 'auto', paddingTop: '5px'}}>
          <img id='postImg' src={img} alt="Couldn't Generate"/>
          <h5 style={{paddingTop:'5px'}}>{title}</h5> 
          <Button id='openlink' onClick={() => window.open(url)}>Open Link</Button> 
        </Col>
        <Col xs={7} style={{ margin: 'auto', textAlign: 'left', paddingTop:'5px'}}>
          <p id='caption'>
            <input className='usernameLink' type='submit' value={poster} id='userLink' onClick={getProfile}/>
            {caption}
          </p>
          <Button id='link' onClick={likeHandler}>{posterProfile.likeCount} Likes</Button>
          <Button id='link' onClick={commentPage}>{posterProfile.comCount} Comments</Button>
        </Col>
      </Row>
    </Container>
    );
  }
}

export default ShowPost;
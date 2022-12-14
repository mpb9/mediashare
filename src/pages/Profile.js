import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Row } from "react-bootstrap";
import './Profile.css';
import MyPosts from "../helpers/MyPosts";

const USER_INFO = "http://youRL.site/youRLapi/user-apis/userinfo.php";
const NEW_PROFILE_INFO = "http://youRL.site/youRLapi/user-apis/newprofileinfo.php";

function Profile({user}) {
  const [inputs, setInputs] = useState({
    name: user,
    edit: false
  });
  const [info, setInfo] = useState({
    name: user,
    email: '',
    fullname: '',
    bio: '',
    img: '',
    lastImg: ''
  });


  useEffect(() => { // GETS USER'S EMAIL, FULLNAME, BIO, IMG ON LOAD
    axios({
      method: "post",
      url: `${USER_INFO}`,
      headers: { "content-type": "application/json" },
      data: inputs
    })
    .then((result) => {
      setInfo(values => ({...values, email: result.data.email}));
      setInfo(values => ({...values, fullname: result.data.fullname}));
      setInfo(values => ({...values, bio: result.data.bio}));
      setInfo(values => ({...values, img: result.data.img}));
      setInfo(values => ({...values, lastImg: result.data.img}));
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  const EditHandler = (event)  => {   // HANDLES EDIT BUTTON CLICK
    event.preventDefault();
    setInputs(values => ({...values, edit: true}))
  }

  const imgHandler = (event) => { 
    const value = event.target.value;
    setInfo(values => ({...values, img: value}));
  }
  const bioHandler = (event) => {
    const value = event.target.value;
    setInfo(values => ({...values, bio: value}))
  }
  const nameHandler = (event) => {
    const value = event.target.value;
    setInfo(values => ({...values, fullname: value}))
  }
  const emailHandler = (event) => {
    const value = event.target.value;
    setInfo(values => ({...values, email: value}))
  }

  const DoneEditingHandler = (event)  => {   
    event.preventDefault();
    
    axios({
      method: "post",
      url: `${NEW_PROFILE_INFO}`,
      headers: { "content-type": "application/json" },
      data: info
    }).catch((error) => {
      console.log(error);
    });

    if(info.img.length === 0){
      setInfo(values => ({...values, img: info.lastImg}));
    } else {
      setInfo(values => ({...values, lastImg: info.img}));
    }

    setInputs(values => ({...values, edit: false}));
  }
  const CancelEditingHandler = (event)  => {   
    event.preventDefault();

    if(info.img.length === 0){
      setInfo(values => ({...values, img: info.lastImg}));
    } else {
      setInfo(values => ({...values, lastImg: info.img}));
    }

    setInputs(values => ({...values, edit: false}));
  }

  

  if(!inputs.edit){
    return(
      <Container style={{ padding:'5px', width:'100%', height:'100%', margin: 'auto'}}>
        <Row style={{padding:'3px', height:'40%', width:'100%', margin: 'auto', textAlign: 'center'}}>
          <Container id='profBio' >
            <img id='profImg' src={info.img} alt=""/>
            <h5 style={{ padding:'0px', marginBottom:'0px'}}>{info.fullname}</h5>
             {info.bio}
            <h5 style={{margin:'auto', paddingTop: '10px'}}>
            <Button id='editBut' onClick={(event) => EditHandler(event)}> Edit </Button>
            </h5>
          </Container>
          
        </Row>
        <MyPosts username={inputs.name}/>
      </Container>
    );
  } else {
    return(
      <Container style={{ padding:'5px', width:'100%', margin: 'auto'}}>
          <h4>Edit: {user}</h4>
          <form action='#' style={{width:'90%',  margin:'auto'}}>
            <img id='profImg' src={info.img} alt=""/>
            <h6>Profile Picture</h6> 
            <input type="text" id="editNameInput" placeholder="image link" value={info.img || ""} onChange={imgHandler}/>
            <h6>Full Name</h6>
            <input type="text" id="editNameInput" placeholder="full name" maxLength="50" value={info.fullname || ""} onChange={nameHandler}/>
            <h6>Email</h6>
            <input type="text" id="editNameInput" placeholder="email" maxLength="50" value={info.email || ""} onChange={emailHandler}/>
            <h6>Bio</h6>     
            <textarea type='text' id='editBioInput' placeholder="bio" maxLength="150" value={info.bio || ""} onChange={bioHandler} /> 
            
            <Button id='nvmBut' onClick={(event) => CancelEditingHandler(event)}> Cancel </Button>
            <Button id='doneBut' onClick={(event) => DoneEditingHandler(event)}> Done </Button>
          </form>
      </Container>
    );
  }
    
}

export default Profile;
import React from 'react';
import {Link} from 'react-router-dom';
import EntriesList from "./EntriesList";

const Home = () => {
    return (
        <div className={'home-page'}>
            <h1 className={"text-center"} style={{marginBottom: '20px'}}>Welcome home!!!</h1>
            <Link className={"btn btn-primary"} to={"/add"}>Add Entry</Link>
            <EntriesList/>
        </div>
    );
};

export default Home;
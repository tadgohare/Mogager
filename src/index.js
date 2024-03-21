import React from "react";
import ReactDOM from 'react-dom/client';
import Page from "./Page" //change this line

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Page />);
//ReactDOM.render(<Page />, document.getElementById('root'));
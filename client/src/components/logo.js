import React from 'react';
import { Link } from 'react-router';
export default (props) => {
  return (
    <div className="logo-container col-md-2 col-xs-4">
      <Link to="/"><h4>The Logo</h4></Link>
    </div>
  );
}

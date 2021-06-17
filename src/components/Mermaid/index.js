// This is a copy of https://github.com/jasonbellamy/react-mermaid/, but
// modified to:
//  1. support SSR
//  2. automatically work with multiple diagrams on the same page (react-mermaid
//     requires you to manually give each a instance a different name).
//
// The MIT License (MIT)
//
// Copyright (c) 2015 Jason Bellamy
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React from 'react';
import PropTypes from 'prop-types';

let lastID = 0;

function nextID() {
  return lastID++;
}

class Mermaid extends React.Component {

  state = {
    name: '',
    diagram: 'Loading diagram...',
  }

  componentDidMount() {
    import('mermaid').then((mermaid) => {
      if (!this.state.name) {
        this.setState({name: this.props.name || `mermaid-${nextID()}`});
      }
      mermaid.mermaidAPI.render(this.state.name, this.props.children.toString(), (html) => {
        this.setState({diagram: html});
      });
    });
  }

  render() {
    return (
      <div className="mermaid" dangerouslySetInnerHTML={{__html: this.state.diagram}}></div>
    )
  }

}

Mermaid.propTypes = {
  name: PropTypes.string,
};

Mermaid.defaultProps = {
  name: '',
};

export default Mermaid;

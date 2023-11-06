import React, { Component, Fragment, ReactNode } from 'react';
import './DraggableResizable.css';

interface DraggableResizableProps {
  children: ReactNode;
  left: number;
  top: number;
  width: number;
  height: number;
  resizeable?: boolean,
  draggable?: boolean,
  bounds?: any,
  onDragStop?: ({}:any) => void,
  onResizeStop?: ({}:any) => void
}

interface DraggableResizableState {
  left: number;
  top: number;
  width: number;
  height: number;
  resizeable?: boolean
  draggable?: boolean
}


class DraggableResizable extends Component<DraggableResizableProps, DraggableResizableState> {
  private boxRef: React.RefObject<HTMLDivElement>;

  constructor(props: DraggableResizableProps) {
    super(props);
    const { left, top, width, height, resizeable, draggable } = props;
    this.state = {
      left,
      top,
      width,
      height,
      draggable,
      resizeable
    };

    this.boxRef = React.createRef();
  }


  componentWillReceiveProps(props: DraggableResizableProps) {
    const { left, top, width, height, resizeable, draggable } = props;
    this.setState({
      left,
      top,
      width,
      height,
      draggable,
      resizeable
    })
  }

  handleDragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.state.draggable === false) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    const el = this.boxRef.current;
    if (!el) {
      return;
    }
    const { clientX, clientY } = e;
    
    const { offsetTop, offsetLeft } = el as HTMLElement;

    const elemWidth = el.offsetWidth;
    const elemHeight = el.offsetHeight;
   
    let bounds: any;
    if (this.props.bounds === 'parent' && el?.offsetParent) {
      const { offsetHeight, offsetWidth } = el.offsetParent as HTMLElement;
      bounds = {
        left: 0,
        top: 0,
        width: offsetWidth,
        height: offsetHeight
      }
    }
    
    let diffX = clientX - offsetLeft;
    let diffY = clientY - offsetTop;
    const move = (event: any) => {
      const { clientX, clientY } = event;
      let left = clientX - diffX;
      let top = clientY - diffY;
      if (bounds) {
        if (left < bounds.left) {
          left = 0
        }
        if (top < bounds.top) {
          top = 0;
        }
        if (left + elemWidth > bounds.width) {
          left = bounds.width - elemWidth;
        }
        if (top + elemHeight > bounds.height) {
          top = bounds.height - elemHeight;
        }
      }
      
      this.setState({
        left,
        top
      })
    }
    const end = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
      if (this.props.onDragStop) {
        this.props.onDragStop({
          left: this.state.left,
          top: this.state.top
        })
      }
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
    
  };


  handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>, flag: string) => {
    if (this.state.resizeable === false) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const el = this.boxRef.current;
    if (!el) {
      return;
    }
    const { clientX, clientY } = e;
    let initialX = clientX;
    let initialY = clientY;
    let initialWidth = el.offsetWidth;
    let initialHeight = el.offsetHeight;
    let initialLeft = el.offsetLeft;
    let initialTop = el.offsetTop;

    const move = (event: any) => {
      const deltaX = event.clientX - initialX;
      const deltaY = event.clientY - initialY;
      if (flag === 'left') {
        this.setState({
          left: initialLeft + deltaX,
          width: initialWidth - deltaX
        })
      } else if (flag === 'right') {
        this.setState({
          width: initialWidth + deltaX
        })
      } else if (flag === 'top') {
        this.setState({
          top: initialTop + deltaY,
          height: initialHeight - deltaY
        })
      } else if (flag === 'bottom') {
        this.setState({
          height: initialHeight + deltaY
        })
      } else if (flag === 'top-left') {
        this.setState({
          left: initialLeft + deltaX,
          top: initialTop + deltaY,
          width: initialWidth - deltaX,
          height: initialHeight - deltaY
        });
      } else if (flag === 'top-right') {
        this.setState({
          top: initialTop + deltaY,
          width: initialWidth + deltaX,
          height: initialHeight - deltaY
        });
      } else if (flag === 'bottom-left') {
        this.setState({
          left: initialLeft + deltaX,
          width: initialWidth - deltaX,
          height: initialHeight + deltaY
        });
      } else if (flag === 'bottom-right') {
        this.setState({
          width: initialWidth + deltaX,
          height: initialHeight + deltaY
        });
      }
    }
    const end = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
      if (this.props.onResizeStop) {
        this.props.onResizeStop({
          left: this.state.left,
          top: this.state.top,
          width: this.state.width,
          height: this.state.height
        })
      }
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
  }


  render() {
    const { left, top, width, height, resizeable } = this.state;
    const { children } = this.props;

    return (
      <div
        ref={this.boxRef}
        className="draggable-resizable"
        onMouseDown={this.handleDragMouseDown}
        style={{ width: width, height: height, left: left, top: top }}
      >
        {
          resizeable !== false && <Fragment>
            <div className="resizable-handle top-left" onMouseDown={(e) => this.handleResizeMouseDown(e, 'top-left')}></div>
            <div className="resizable-handle top" onMouseDown={(e) => this.handleResizeMouseDown(e, 'top')}></div>
            <div className="resizable-handle top-right" onMouseDown={(e) => this.handleResizeMouseDown(e, 'top-right')}></div>
            <div className="resizable-handle left" onMouseDown={(e) => this.handleResizeMouseDown(e, 'left')}></div>
            <div className="resizable-handle right" onMouseDown={(e) => this.handleResizeMouseDown(e, 'right')}></div>
            <div className="resizable-handle bottom-left" onMouseDown={(e) => this.handleResizeMouseDown(e, 'bottom-left')}></div>
            <div className="resizable-handle bottom" onMouseDown={(e) => this.handleResizeMouseDown(e, 'bottom')}></div>
            <div className="resizable-handle bottom-right" onMouseDown={(e) => this.handleResizeMouseDown(e, 'bottom-right')}></div>
          </Fragment>
        }
        {children}
      </div>
    );
  }
}

export default DraggableResizable;

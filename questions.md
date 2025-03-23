1. What is the difference between Component and PureComponent?
Give an example where it might break my app.

React.Component always re-renders when its state or props change, even if the new values are the same.

Re-renders unnecessarily unless manually optimized with shouldComponentUpdate().

PureComponent (Optimized Version of Component)
React.PureComponent automatically implements a shallow comparison (shouldComponentUpdate) for state and props.

Prevents unnecessary re-renders if the new props/state are the same as the previous ones.

If PureComponent is used with mutable objects (like arrays or nested objects), it may not detect changes, causing the UI to not update properly.

```
import React, { PureComponent, useState } from "react";

class Child extends PureComponent {
  render() {
    console.log("Child Rendered!"); // This should log every update
    return <p>Counter: {this.props.data.count}</p>;
  }
}

const Parent = () => {
  const [state, setState] = useState({ count: 0 });

  return (
    <div>
      <Child data={state} />
      <button onClick={() => state.count++}>Increment</button> {/*  Directly mutating state */}
    </div>
  );
};

```
2. Context + ShouldComponentUpdate might be dangerous. Why is
that?

It might be dangerous because React Context Causes Re-Renders for All Consumers Any component consuming Context re-renders whenever the provider's value changes, even if that component’s props/state haven’t changed. But This bypasses shouldComponentUpdate() or React.PureComponent. PureComponent or shouldComponentUpdate Ignores Context Changes. This can cause stale or outdated data in components that rely on context.

```
import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext({ theme: "light" });

class ChildComponent extends React.PureComponent {
  render() {
    console.log("ChildComponent Rendered!");
    return <p>Theme: {this.context.theme}</p>;
  }
}
ChildComponent.contextType = ThemeContext;

const Parent = () => {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme }}>
      <ChildComponent />
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </ThemeContext.Provider>
  );
};

```




3. Describe 3 ways to pass information from a component to its
PARENT.
- using Callback functions. When parent passes a function to its child can pass the data in function which can be accessed in parent when the function triggers.

```
const Parent = () => {
  const [message, setMessage] = useState("");

  // Function to receive data from child
  const handleChildData = (data: string) => {
    setMessage(data);
  };

  return (
    <div>
      <h2>Message from Child: {message}</h2>
      <Child sendDataToParent={handleChildData} />
    </div>
  );
};

const Child = ({ sendDataToParent }: { sendDataToParent: (data: string) => void }) => {
  return (
    <button onClick={() => sendDataToParent("Hello, Parent!")}>
      Send Message
    </button>
  );
};

```
- Using useImperativeHandle() with forwardRef, This method exposes functions or values from the child that the parent can access via useRef.
Useful when the parent needs to trigger functions inside the child component.
```
import React, { useRef, useImperativeHandle, forwardRef } from "react";

const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    showAlert: () => {
      alert("Alert from Child!");
    }
  }));

  return <p>Child Component</p>;
});

const Parent = () => {
  const childRef = useRef<any>(null);

  return (
    <div>
      <button onClick={() => childRef.current?.showAlert()}>
        Call Child Method
      </button>
      <Child ref={childRef} />
    </div>
  );
};

```

- 3. Using Context API For Deeply Nested Components. This lets us send the data from child to more level up in the heirarchy.

```
    import React, { createContext, useState, useContext } from "react";

    // Create Context
    const MessageContext = createContext<any>(null);

    const Parent = () => {
        const [message, setMessage] = useState("");

        return (
            <MessageContext.Provider value={{ message, setMessage }}>
            <h2>Message from Child: {message}</h2>
            <Child />
            </MessageContext.Provider>
        );
    };

    const Child = () => {
        const { setMessage } = useContext(MessageContext);

        return (
            <button onClick={() => setMessage("Hello from Child!")}>
            Send Message
            </button>
        );
    };

```

4. Give 2 ways to prevent components from re-rendering.
 - Use shouldComponentUpdate() (For Class Components) define the conditions where the component doesn't need an update.
 - use React.pureComponent
    ```
        class PureComponentExample extends React.PureComponent {
            render() {
                console.log("PureComponent Rendered!");
                return <p>Count: {this.props.count}</p>;
            }
        }

        class App extends React.Component {
            state = { count: 0 };

            increment = () => this.setState({ count: this.state.count });

            render() {
                return (
                <div>
                    <PureComponentExample count={this.state.count} />
                    <button onClick={this.increment}>Increment</button>
                </div>
                );
            }
        }
    ```
 - use React.memo (For Functional Components)
    React.memo() is a higher-order component (HOC) that prevents a functional component from re-rendering if its props haven't changed.

    Useful for optimizing performance in components that receive the same props frequently.

    ```
        import { memo } from "react";

        const Todos = ({ todos }) => {
            console.log("child render");
            return (
                <>
                <h2>My Todos</h2>
                {todos.map((todo, index) => {
                    return <p key={index}>{todo}</p>;
                })}
                </>
            );
        };

        export default memo(Todos);

    ```

5. What is a fragment and why do we need it? Give an example where it
might break my app.

 Fragment is used to group multiple elements into single elements. In React while using JSX expressions or components must return a single element. To satisfy many people keep adding divs and that makes the dom unnecessary heavy. Fragment lets us avoid that by wrapping multiple jsx element into one and doesn't impact the output dom.



6. Give 3 examples of the HOC pattern.
A Higher-Order Component (HOC) is a function that takes a component as an argument and returns a new enhanced component. It's commonly used for code reuse, logic abstraction, and behavior extension.

Difference examples of HOC are as follows.
 - withRouter - HOC components like withRouter in react-router gives the functionality to expose the route data and method through props to any component.
 ```
    export const withRouter(HomePage)
 ```

 - withAuth - withAuth HOC can be created to authenticate each page if the user is logged in or not and then allow the page to render or redirect to login page

```
    import React from "react";

    // HOC to check authentication
    const withAuth = (WrappedComponent: React.FC) => {
    return (props: any) => {
        const isAuthenticated = localStorage.getItem("token"); // Example check

        if (!isAuthenticated) {
        return <div>Please log in to access this page.</div>;
        }

        return <WrappedComponent {...props} />;
    };
    };

    // Usage
    const Dashboard = () => <h2>Welcome to Dashboard</h2>;
    export default withAuth(Dashboard);
 ```

 - withAnalytics - withAnalytics HOC can be used to log page level data when any page component loads . 

 ```
    const withLogger = (WrappedComponent: React.FC) => {
        return (props: any) => {
            console.log("Props updated:", props);
            // call analytics here
            return <WrappedComponent {...props} />;
        };
    };

    // Usage
    const Profile = ({ name }: { name: string }) => <h2>User: {name}</h2>;
    export default withAnalytics(Profile);
 ```

7. What's the difference in handling exceptions in promises,
callbacks and async...await?
 - In Callbacks Error or Exceptions can be handled only through callback parameters by passing error into the callback function.
 It doesn't have built in way to get the error, we have to find the error and pass it ourselves to flow through our error handler. Also error cannot be thrown by use but only created and or passed in the callback function to be handled in the handler. This is non-clean way of handling the exceptions.

 ```
    function fetchData(callback) {
    setTimeout(() => {
        const error = new Error("Something went wrong!");
        callback(error, null);
    }, 1000);
    }

    fetchData((err, data) => {
    if (err) {
        console.error("Error:", err.message); // Handle error explicitly
        return;
    }
    console.log("Data:", data);
    });
 ```

 - In Promises exceptions can be handled in catch block if any promise fails. It is still better than callbacks. If promise is rejected or error is thrown in then block we can handle the same in catch block.

 ```
    function fetchData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("Something went wrong!")), 1000);
        });
    }

    fetchData()
    .then((data) => console.log("Data:", data))
    .catch((err) => console.error("Error:", err.message)); // Catch errors here

 ```

 - Async Await make code more readable and error handling is also best in terms of all three. It executes in such a way that the code execution looks syncronous although if its not. This make the code more readable than .then().catch() handlers.

 ```
    async function fetchData() {
        throw new Error("Something went wrong!");
    }

    async function main() {
        try {
            const data = await fetchData();
            console.log("Data:", data);
        } catch (err) {
            console.error("Error:", err.message); // Catches error
        }
    }

    main();


 ```



8. How many arguments does setState take and why is it async.

setState in React can take two arguments:

A new state object or a function that returns the new state

An optional callback function that runs after the state update is applied

### without Callback

```
this.setState({
    count: count+1
})
```

### with Callback
```
this.setState({
    count: count+1
},()=>{
    console.log('__log__updated___count__',this.state.count)
})
```


setState is async due to following reasons - 
- It batches updates to avoid re-renders as UI needs to be updated everytime state updates, so react batches multiple state updated into a single state update which only triggers single render.
- It can cause state or inconsistent data.
- Syncronous Execution can block the main thread for a long time, as state updates and UI rendering become syncronous react can't do any other work.
React fibre with asyncronous state updates can schedule and prioritize important pieces of work by breaking this updates into batches.


9. List the steps needed to migrate a Class to Function
Component.
Steps to Migrate a Class Component to a Function Component
- Remove `extends React.Component` → Convert the class into a function.
- Remove the `render()` method → The function itself acts as `render()`.
- Convert `this.state` to `useState()` → Replace `setState()` with `useState()`.
  convert this.state to single state of object or use individul states for different state variables.
- Replace lifecycle methods with `useEffect()`:
    - `componentDidMount` → `useEffect(() => {...}, [])`
    - `componentDidUpdate` → `useEffect(() => {...}, [dependencies])`
    - `componentWillUnmount` → Cleanup function inside `useEffect()`.
- Remove `this.props` → Use destructuring in function parameters.
- Convert class methods to arrow functions → No need for `this` binding.
- Handle event handlers directly → No need for `.bind(this)`.
- Replace `createRef()` with `useRef()` → Manage DOM references with `useRef()`.
- Use `useContext()` instead of `Context.Consumer` → Simpler context access.
- Use `useReducer()` for complex state logic → Alternative to `setState()`.
- Replace static `defaultProps` with default function parameters.
- Replace functions using closures( eg. debounce, throttle etc) in classComponents need to be moved in `useCallback` as functional components recreates function definition and closure reference is lost

10.List a few ways styles can be used with components.
- We can use styles in many ways in React components. Few of the ways are as follow - 
1) CSS files
2) Inline Styles
3) CSS in JS
4) CSS modules (these generates dynamic css classes)
5) External CSS Libraries like tailwind, etc
6) Sass/Less 


11. How to render an HTML string coming from the server.

To render any HTML string coming from server. We need to sanitize it first as it can contain some malicious code as well. We can use dom sanitizers like dompurify or custom any other robust sanitizer method to sanitize it safely.

```
let data = apiData;
<div dangerouslySetInnerHTML={{ __html: domPurify(data) }}></div>
```
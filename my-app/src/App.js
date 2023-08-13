import { useState, useEffect } from "react";
import { GithubFilled, DeleteFilled, EditFilled } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const App = () => {

  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChat, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitles) => {
    setCurrentTitle(uniqueTitles);
    setMessage(null);
    setValue("");
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // 阻止表单默认的提交行为
    getMessages();
  };

  const handleKeyDown = (event) => {
    setValue(event.target.value);
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    };
    try {
      const response = await fetch('http://149.127.204.249:9940/completions', options);
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => ([
        ...prevChats,
        {
          title: currentTitle,
          content: value,
          role: 'me' // 添加 role 属性
        },
        {
          title: currentTitle,
          content: message.content,
          role: 'ai' // 添加 role 属性
        }
      ]
        // 清空输入框
      ));
      setValue('');
    }
  }, [message, currentTitle]);

  console.log(currentTitle); //打印标题，为了存储数据

  const currentChat = previousChat.filter(previousChat => previousChat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChat.map(previousChat => previousChat.title)));

  return (
    <div className="app">
      <section className="sider-bar">
        <button className="new-chat" onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitles, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitles)}>
              {uniqueTitles}&emsp;&emsp;&emsp;&emsp;&emsp;<EditFilled />&nbsp;&nbsp;<DeleteFilled />
            </li>
          ))}
        </ul>

        <nav>
          <a href="https://github.com/ataliya-long/ChatGPT-shanzhai-version" className="line">
            <p><GithubFilled />&nbsp;&nbsp;&nbsp;Ataliya</p>
          </a>
        </nav>
      </section>

      <section className="main">
        {!currentTitle && <h1>AtaliyaGPT</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">
                {chatMessage.role === 'me' ? (
                  <img src="https://www.thiswaifudoesnotexist.net/example-5834.jpg" className="avatar" alt="me" />
                ) : (
                  <img src="https://www.thiswaifudoesnotexist.net/example-56416.jpg" className="avatar" alt="ai" />
                )}
              </p>
              <ReactMarkdown className="message-content">{chatMessage.content}</ReactMarkdown>
            </li>
          ))}
        </ul>

        <div className="bottom-section">
          <form className="forms" onSubmit={handleSubmit}>
            <input
              placeholder="Send a message..."
              value={value}
              onChange={handleKeyDown}
            />
            <button className="button" type="submit" id="submit">➢</button>
          </form>

          <p className="info">
            ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT May 3 Version
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
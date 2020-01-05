import React, {
  useEffect,
  useState,
  useRef,
  CSSProperties,
  FunctionComponent
} from 'react';

import './live2d.min.js';
import './style.scss';
import { remote, webFrame } from 'electron';
import emitter from '@/utils/emitter';

interface IWaifuTips {
  mouseover: Mouseover[];
  click: Mouseover[];
  seasons: Season[];
}

interface Season {
  date: string;
  text: string;
}

interface Mouseover {
  selector: string;
  text: string[];
}

const { screen, getCurrentWindow } = remote;

const defaultSize = 350;

const apiBaseUrl = 'https://ppet.zenghongtu.com/api';

const currentWindow = getCurrentWindow();

const getIdFromLocalStorage = (name: string, defaultId = 1): number => {
  const _id = localStorage.getItem(name) || defaultId;
  return +_id;
};

const Pet: FunctionComponent = () => {
  const [isPressAlt, setIsPressAlt] = useState<boolean>(false);
  const [isShowTools, setIsShowTools] = useState<boolean>(true);
  const [showWaifu, setShowWaifu] = useState<boolean>(true);
  const [tips, setTips] = useState<{
    priority: number;
    text: string;
  } | null>(null);

  const [messageArray, setMessageArray] = useState<string[]>([
    '好久不见，日子过得好快呢……',
    '大坏蛋！你都多久没理人家了呀，嘤嘤嘤～',
    '嗨～快来逗我玩吧！',
    '拿小拳拳锤你胸口！',
    '记得把小家加入 Adblock 白名单哦！'
  ]);

  const messageTimerRef = useRef<number | null>(null);
  const intervalSetRef = useRef<{
    startTime: Date;
    timer: number | null;
  } | null>(null);
  const hitokotoTimerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const waifuRef = useRef<HTMLDivElement>(null);
  const winSizeRef = useRef<{
    width: number;
    height: number;
  }>({ width: defaultSize, height: defaultSize });

  useEffect(() => {
    initModel();
    showUp();
    const handleShowTool = (isShow: boolean) => {
      setIsShowTools(isShow);
    };
    emitter.on('show-tool', handleShowTool);
    return () => {
      emitter.off('show-tool', handleShowTool);
    };
  }, []);

  useEffect(() => {
    const handleKeydown = handleKeyEvent.bind(null, true);
    const handleKeyup = handleKeyEvent.bind(null, false);
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('keyup', handleKeyup);
    };
  }, []);

  useEffect(() => {
    currentWindow.on('blur', handleWindowBlur);
    currentWindow.on('focus', handleWindowFocus);
    return () => {
      currentWindow.removeListener('blur', handleWindowBlur);
      currentWindow.removeListener('focus', handleWindowFocus);
    };
  }, []);

  const handleWindowBlur = () => {
    const timer = window.setInterval(() => {
      if (!intervalSetRef.current) {
        return;
      }

      const curTS = new Date().getTime();
      const startTS =
        intervalSetRef.current.startTime &&
        intervalSetRef.current.startTime.getTime();

      if (!startTS) {
        return;
      }

      const duration = Math.floor((curTS - startTS) / (1e3 * 60));
      // TODO 更多语句
      const text = `你已经持续工作${duration}分钟了，该休息一下和我玩耍了哦~`;
      showMessage(text, 6000, 9);
    }, 25 * 60 * 1e3);

    intervalSetRef.current = { startTime: new Date(), timer };
  };

  const handleWindowFocus = () => {
    if (!intervalSetRef.current) {
      return;
    }
    const timer = intervalSetRef.current.timer;
    if (timer) {
      clearInterval(timer);
    }
  };

  const handleKeyEvent = (val: boolean, ev: KeyboardEvent) => {
    if (ev.key === 'Alt') {
      if (val) {
        showMessage('可以用滚轮把我变大变小了哦~', 4000, 12);
      } else {
        setTips(null);
      }
      setIsPressAlt(val);
    }
  };

  const showMessage = (
    text: string | string[],
    timeout: number,
    priority = 0
  ) => {
    if (!text || (tips && tips.priority > priority)) return;

    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
      messageTimerRef.current = null;
    }

    if (Array.isArray(text)) {
      text = text[Math.floor(Math.random() * text.length)];
    }

    setTips({
      text,
      priority
    });

    messageTimerRef.current = window.setTimeout(() => {
      setTips(null);
    }, timeout);
  };

  const loadModel = (modelId: number, modelTexturesId = 0): void => {
    localStorage.modelId = modelId;
    localStorage.modelTexturesId = modelTexturesId;

    loadlive2d(
      'live2d',
      `${apiBaseUrl}/get/?id=${modelId}-${modelTexturesId}`,
      console.log(`Live2D 模型 ${modelId}-${modelTexturesId} 加载完成`)
    );
  };

  const initModel = () => {
    const modelId = getIdFromLocalStorage('modelId');
    const modelTexturesId = getIdFromLocalStorage('modelTexturesId', 53);

    loadModel(+modelId, +modelTexturesId);

    // TODO 自定义
    const defaultTips: IWaifuTips = require('./waifu-tips.json');

    defaultTips.mouseover.forEach(tips => {
      window.addEventListener('mouseover', event => {
        if (
          !event.target ||
          !(event.target as HTMLDivElement).matches(tips.selector)
        )
          return;
        let text = Array.isArray(tips.text)
          ? tips.text[Math.floor(Math.random() * tips.text.length)]
          : tips.text;
        text = text.replace(
          '{text}',
          (event.target as HTMLDivElement).innerText
        );
        showMessage(text, 4000, 8);
      });
    });

    defaultTips.click.forEach(tips => {
      window.addEventListener('click', event => {
        if (
          !event.target ||
          !(event.target as HTMLDivElement).matches(tips.selector)
        )
          return;
        let text = Array.isArray(tips.text)
          ? tips.text[Math.floor(Math.random() * tips.text.length)]
          : tips.text;
        text = text.replace(
          '{text}',
          (event.target as HTMLDivElement).innerText
        );
        showMessage(text, 4000, 8);
      });
    });

    defaultTips.seasons.forEach(tips => {
      const now = new Date(),
        after = tips.date.split('-')[0],
        before = tips.date.split('-')[1] || after;
      if (
        +after.split('/')[0] <= now.getMonth() + 1 &&
        +now.getMonth() + 1 <= +before.split('/')[0] &&
        +after.split('/')[1] <= now.getDate() &&
        +now.getDate() <= +before.split('/')[1]
      ) {
        let text = Array.isArray(tips.text)
          ? tips.text[Math.floor(Math.random() * tips.text.length)]
          : tips.text;
        text = text.replace('{year}', now.getFullYear());
        //showMessage(text, 7000, true);
        setMessageArray([...messageArray, text]);
      }
    });
  };

  const loadOtherTextures = (rand = false) => {
    const modelId = getIdFromLocalStorage('modelId');
    const modelTexturesId = getIdFromLocalStorage('modelTexturesId', 53);
    // 可选 "rand"(随机), "switch"(顺序)
    fetch(
      `${apiBaseUrl}/${
        rand ? 'rand' : 'switch'
      }_textures/?id=${modelId}-${modelTexturesId}`
    )
      .then(response => response.json())
      .then(result => {
        if (
          result.textures.id === 1 &&
          (modelTexturesId === 1 || modelTexturesId === 0)
        )
          showMessage('我还没有其他衣服呢！', 4000, 10);
        else showMessage('我的新衣服好看嘛？', 4000, 10);
        loadModel(modelId, result.textures.id);
      });
  };

  const loadOtherModel = (rand = false) => {
    const modelId = getIdFromLocalStorage('modelId');
    fetch(`${apiBaseUrl}/${rand ? 'rand' : 'switch'}/?id=${modelId}`)
      .then(response => response.json())
      .then(result => {
        loadModel(result.model.id);
        showMessage(result.model.message, 4000, 10);
        localStorage.modelMessage = result.model.message;
      });
  };

  const welcomeMessage = () => {
    const now = new Date().getHours();
    let text;

    if (now > 5 && now <= 7)
      text = '早上好！一日之计在于晨，美好的一天就要开始了。';
    else if (now > 7 && now <= 11)
      text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
    else if (now > 11 && now <= 13)
      text = '中午了，工作了一个上午，现在是午餐时间！';
    else if (now > 13 && now <= 17)
      text = '午后很容易犯困呢，今天的运动目标完成了吗？';
    else if (now > 17 && now <= 19)
      text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～';
    else if (now > 19 && now <= 21) text = '晚上好，今天过得怎么样？';
    else if (now > 21 && now <= 23)
      text = ['已经这么晚了呀，早点休息吧，晚安～', '深夜时要爱护眼睛呀！'];
    else text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？';

    showMessage(text, 7000, 8);
  };

  // TODO 节流
  const showHitokoto = () => {
    fetch('https://v1.hitokoto.cn')
      .then(response => response.json())
      .then(result => {
        const text = `这句一言来自 <span>「${result.from}」</span>，是 <span>${result.creator}</span> 在 hitokoto.cn 投稿的。`;
        showMessage(result.hitokoto, 6000, 10);
        if (hitokotoTimerRef.current) {
          clearTimeout(hitokotoTimerRef.current);
        }
        hitokotoTimerRef.current = window.setTimeout(() => {
          showMessage(text, 6000, 9);
        }, 4000);
      });
  };

  const capture = () => {
    showMessage('照好了嘛，是不是很可爱呢？', 6000, 9);
    Live2D.captureName = `${+new Date()}.png`;
    Live2D.captureFrame = true;
  };

  const showInfo = () => {
    const modelId = localStorage.modelId || '未知';
    const modelTexturesId = localStorage.modelTexturesId || '未知';
    const modelMessage = localStorage.modelMessage;

    const text = `${modelMessage}, modelId: ${modelId}, modelTexturesId: ${modelTexturesId}`;
    showMessage(text, 8000, 11);
  };

  const showPlugins = () => {
    showMessage('插件中心，还在努力开发中...', 4000, 12);
  };

  const hideWaifu = () => {
    showMessage('愿你有一天能与重要的人重逢。', 2000, 11);
    waifuRef.current && (waifuRef.current.style.bottom = '-1000px');
    window.setTimeout(() => {
      setShowWaifu(false);
      currentWindow.setSize(40, 80);
      const { x, y } = screen.getCursorScreenPoint();
      currentWindow.setPosition(x - 20, y - 40);
    }, 2000);
  };

  const showUp = () => {
    const isSwitch = !showWaifu;
    if (isSwitch) {
      setShowWaifu(true);
      const { width, height } = winSizeRef.current;
      currentWindow.setSize(width, height);
      const { x, y } = screen.getCursorScreenPoint();
      currentWindow.setPosition(x - width, y - height);
    }
    window.setTimeout(() => {
      waifuRef.current && (waifuRef.current.style.bottom = '0');
    });
    window.setTimeout(() => {
      isSwitch ? showMessage(messageArray, 2000) : welcomeMessage();
    }, 2000);
  };

  const toolList = [
    { name: 'comment', icon: 'comment', call: showHitokoto },
    { name: 'user', icon: 'user-circle', call: loadOtherModel },
    { name: 'clothes', icon: 'street-view', call: loadOtherTextures },
    { name: 'camera', icon: 'camera-retro', call: capture },
    { name: 'plugin', icon: 'inbox', call: showPlugins },
    { name: 'info', icon: 'info-circle', call: showInfo },
    { name: 'hide', icon: 'eye-slash', call: hideWaifu }
  ];

  const handleToolListClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const name = (e.target as HTMLSpanElement).dataset.name;
    if (name) {
      const findItem = toolList.find(item => item.name === name);
      if (findItem) {
        findItem.call();
      } else {
        console.error('click item: ', name);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isPressAlt) {
      e.preventDefault();

      let zoomFactor = webFrame.getZoomFactor();

      if (e.deltaY > 0) {
        zoomFactor += 0.1;
      } else {
        zoomFactor -= 0.1;
      }

      if (zoomFactor < 0.3) {
        return;
      }

      webFrame.setZoomFactor(zoomFactor);

      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      scrollTimerRef.current = window.setTimeout(() => {
        const width = Math.floor(defaultSize * zoomFactor);
        const height = Math.floor(defaultSize * zoomFactor);
        currentWindow.setSize(width, height);
        winSizeRef.current = { width, height };
      }, 200);
    }
  };

  interface IWaifuStyle extends CSSProperties {
    WebkitAppRegion: string;
  }
  const waifuStyle: IWaifuStyle = {
    display: showWaifu ? 'block' : 'none',
    cursor: isPressAlt ? 'move' : 'grab',
    WebkitAppRegion: isPressAlt ? 'drag' : 'no-drag'
  };

  return (
    <>
      <div id="waifu" style={waifuStyle} ref={waifuRef} onWheel={handleWheel}>
        {tips && (
          <div
            id="waifu-tips"
            dangerouslySetInnerHTML={{ __html: tips.text }}
          ></div>
        )}
        <canvas id="live2d" width="300" height="300"></canvas>
        {isShowTools && (
          <div id="waifu-tool" onClick={handleToolListClick}>
            {toolList.map(item => {
              const { name, icon } = item;
              return (
                <span
                  key={name}
                  data-name={name}
                  className={`fa fa-lg fa-${icon}`}
                ></span>
              );
            })}
          </div>
        )}
      </div>

      {!showWaifu && (
        <div
          title="双击现身哦~"
          className="waifu-toggle"
          onDoubleClick={showUp}
        >
          現れ
        </div>
      )}
    </>
  );
};

export default Pet;

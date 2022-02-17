import React, { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  animation: shake 50s ease-in-out 5s infinite;
  background-color: rgba(236, 217, 188, 0.5);
  border: 1px solid rgba(224, 186, 140, 0.62);
  border-radius: 12px;
  box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
  font-size: 14px;
  line-height: 24px;
  margin: 2px 20px 0;
  min-height: 50px;
  opacity: 1;
  overflow: hidden;
  padding: 5px 10px;
  position: absolute;
  text-overflow: ellipsis;
  transition: opacity 1s;
  width: calc(100% - 50px);
  word-break: break-all;

  span {
    color: #0099cc;
  }

  @keyframes shake {
    2% {
      transform: translate(0.5px, -1.5px) rotate(-0.5deg);
    }

    4% {
      transform: translate(0.5px, 1.5px) rotate(1.5deg);
    }

    6% {
      transform: translate(1.5px, 1.5px) rotate(1.5deg);
    }

    8% {
      transform: translate(2.5px, 1.5px) rotate(0.5deg);
    }

    10% {
      transform: translate(0.5px, 2.5px) rotate(0.5deg);
    }

    12% {
      transform: translate(1.5px, 1.5px) rotate(0.5deg);
    }

    14% {
      transform: translate(0.5px, 0.5px) rotate(0.5deg);
    }

    16% {
      transform: translate(-1.5px, -0.5px) rotate(1.5deg);
    }

    18% {
      transform: translate(0.5px, 0.5px) rotate(1.5deg);
    }

    20% {
      transform: translate(2.5px, 2.5px) rotate(1.5deg);
    }

    22% {
      transform: translate(0.5px, -1.5px) rotate(1.5deg);
    }

    24% {
      transform: translate(-1.5px, 1.5px) rotate(-0.5deg);
    }

    26% {
      transform: translate(1.5px, 0.5px) rotate(1.5deg);
    }

    28% {
      transform: translate(-0.5px, -0.5px) rotate(-0.5deg);
    }

    30% {
      transform: translate(1.5px, -0.5px) rotate(-0.5deg);
    }

    32% {
      transform: translate(2.5px, -1.5px) rotate(1.5deg);
    }

    34% {
      transform: translate(2.5px, 2.5px) rotate(-0.5deg);
    }

    36% {
      transform: translate(0.5px, -1.5px) rotate(0.5deg);
    }

    38% {
      transform: translate(2.5px, -0.5px) rotate(-0.5deg);
    }

    40% {
      transform: translate(-0.5px, 2.5px) rotate(0.5deg);
    }

    42% {
      transform: translate(-1.5px, 2.5px) rotate(0.5deg);
    }

    44% {
      transform: translate(-1.5px, 1.5px) rotate(0.5deg);
    }

    46% {
      transform: translate(1.5px, -0.5px) rotate(-0.5deg);
    }

    48% {
      transform: translate(2.5px, -0.5px) rotate(0.5deg);
    }

    50% {
      transform: translate(-1.5px, 1.5px) rotate(0.5deg);
    }

    52% {
      transform: translate(-0.5px, 1.5px) rotate(0.5deg);
    }

    54% {
      transform: translate(-1.5px, 1.5px) rotate(0.5deg);
    }

    56% {
      transform: translate(0.5px, 2.5px) rotate(1.5deg);
    }

    58% {
      transform: translate(2.5px, 2.5px) rotate(0.5deg);
    }

    60% {
      transform: translate(2.5px, -1.5px) rotate(1.5deg);
    }

    62% {
      transform: translate(-1.5px, 0.5px) rotate(1.5deg);
    }

    64% {
      transform: translate(-1.5px, 1.5px) rotate(1.5deg);
    }

    66% {
      transform: translate(0.5px, 2.5px) rotate(1.5deg);
    }

    68% {
      transform: translate(2.5px, -1.5px) rotate(1.5deg);
    }

    70% {
      transform: translate(2.5px, 2.5px) rotate(0.5deg);
    }

    72% {
      transform: translate(-0.5px, -1.5px) rotate(1.5deg);
    }

    74% {
      transform: translate(-1.5px, 2.5px) rotate(1.5deg);
    }

    76% {
      transform: translate(-1.5px, 2.5px) rotate(1.5deg);
    }

    78% {
      transform: translate(-1.5px, 2.5px) rotate(0.5deg);
    }

    80% {
      transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
    }

    82% {
      transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
    }

    84% {
      transform: translate(-0.5px, 0.5px) rotate(1.5deg);
    }

    86% {
      transform: translate(2.5px, 1.5px) rotate(0.5deg);
    }

    88% {
      transform: translate(-1.5px, 0.5px) rotate(1.5deg);
    }

    90% {
      transform: translate(-1.5px, -0.5px) rotate(-0.5deg);
    }

    92% {
      transform: translate(-1.5px, -1.5px) rotate(1.5deg);
    }

    94% {
      transform: translate(0.5px, 0.5px) rotate(-0.5deg);
    }

    96% {
      transform: translate(2.5px, -0.5px) rotate(-0.5deg);
    }

    98% {
      transform: translate(-1.5px, -1.5px) rotate(-0.5deg);
    }

    0%,
    100% {
      transform: translate(0, 0) rotate(0);
    }
  }
`

export type TipsType = {
  text: string
  timeout: number
  priority: number
}

const Tips: FC<TipsType> = (props) => {
  const [currentTips, setCurrentTips] = useState<TipsType | null>(null)
  const timerRef = useRef<number>()

  useEffect(() => {
    if (
      props.text &&
      (!currentTips || props.priority >= currentTips.priority)
    ) {
      window.clearTimeout(timerRef.current)
      setCurrentTips(props)

      timerRef.current = window.setTimeout(() => {
        setCurrentTips(null)
      }, props.timeout)
    }
  }, [props.text])

  if (!currentTips) {
    return null
  }

  return (
    <Wrapper dangerouslySetInnerHTML={{ __html: currentTips?.text }}></Wrapper>
  )
}

export default Tips

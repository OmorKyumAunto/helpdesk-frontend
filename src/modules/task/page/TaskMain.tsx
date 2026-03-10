import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetMeQuery } from "../../../app/api/userApi";
import CreateTask from "./CreateTask";
import SuperAdminTaskList from "./SuperAdminTaskList";
import TaskDashboard from "./TaskDashboard";
import TaskListOther from "./TaskListOther";

const Container = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  
  @media (max-width: 768px) {
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const Header = styled.div`
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px 0;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 12px 16px 0;
  }
`;

const TabsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ScrollButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  ${props => props.direction}: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: linear-gradient(
    to ${props => props.direction === 'left' ? 'right' : 'left'},
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.8) 100%
  );
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0;
  pointer-events: none;
  
  &.visible {
    opacity: 1;
    pointer-events: all;
  }
  
  &:hover {
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: #374151;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 0 10px;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    padding: 0;
    gap: 4px;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: ${props => props.active ? '#2563eb' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#6b7280'};
  border-radius: 10px 10px 0 0;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  flex-shrink: 0;
  box-shadow: ${props => props.active ? '0 -2px 8px rgba(37, 99, 235, 0.15)' : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.active ? '#2563eb' : 'transparent'};
    border-radius: 3px 3px 0 0;
    transition: all 0.25s ease;
  }
  
  &:hover {
    color: ${props => props.active ? '#ffffff' : '#1f2937'};
    background: ${props => props.active ? '#1d4ed8' : '#f3f4f6'};
    transform: translateY(-2px);
    box-shadow: ${props => props.active 
      ? '0 -4px 12px rgba(37, 99, 235, 0.2)' 
      : '0 2px 8px rgba(0, 0, 0, 0.08)'};
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
    flex-shrink: 0;
  }
  
  @media (max-width: 1024px) {
    padding: 10px 16px;
    font-size: 13px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    gap: 6px;
    border-radius: 8px 8px 0 0;
    
    span {
      display: ${props => props.active ? 'inline' : 'none'};
    }
  }
`;

const ContentArea = styled.div`
  padding: 15px;
  background: #ffffff;
  min-height: 450px;
  animation: fadeInUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 1024px) {
    padding: 24px;
    min-height: 400px;
  }
  
  @media (max-width: 768px) {
    padding: 20px 16px;
    min-height: 350px;
  }
  
  @media (max-width: 480px) {
    padding: 16px 12px;
    min-height: 300px;
  }
`;

const TaskMain: React.FC = () => {
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const [activeKey, setActiveKey] = useState(
    roleID === 1 ? "1" : roleID === 2 || roleID === 4 ? "4" : "6"
  );
  const [taskStatus, setTaskStatus] = useState("");

  const checkScroll = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftScroll(scrollLeft > 10);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const onChange = (key: string) => {
    setActiveKey(key);
    if (key !== "2" && key !== "5") {
      setTaskStatus("");
    }
  };

  const tabs = [
    ...(roleID === 1
      ? [
          {
            key: "1",
            icon: <LayoutDashboard />,
            label: "Dashboard",
            content: (
              <TaskDashboard
                setTaskStatus={setTaskStatus}
                setActiveKey={setActiveKey}
              />
            ),
          },
          {
            key: "2",
            icon: <ListTodo />,
            label: "All Tasks",
            content: (
              <SuperAdminTaskList key={activeKey} taskStatus={taskStatus} />
            ),
          },
        ]
      : []),
    ...(roleID === 2 || roleID === 4
      ? [
          {
            key: "4",
            icon: <LayoutDashboard />,
            label: "Dashboard",
            content: (
              <TaskDashboard
                setTaskStatus={setTaskStatus}
                setActiveKey={setActiveKey}
              />
            ),
          },
          {
            key: "5",
            icon: <PlusCircle />,
            label: "Create Task",
            content: (
              <CreateTask
                roleID={roleID}
                key={activeKey}
                taskStatus={taskStatus}
              />
            ),
          },
          {
            key: "8",
            icon: <Users />,
            label: "Others Task",
            content: <TaskListOther />,
          },
        ]
      : []),
  ];

  const activeTab = tabs.find(tab => tab.key === activeKey);

  return (
    <Container>
      <Header>
        <TabsWrapper>
          <ScrollButton 
            direction="left" 
            onClick={() => scroll('left')}
            className={showLeftScroll ? 'visible' : ''}
          >
            <ChevronLeft />
          </ScrollButton>
          
          <TabsContainer ref={tabsRef} onScroll={checkScroll}>
            {tabs.map(tab => (
              <Tab
                key={tab.key}
                active={activeKey === tab.key}
                onClick={() => onChange(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Tab>
            ))}
          </TabsContainer>
          
          <ScrollButton 
            direction="right" 
            onClick={() => scroll('right')}
            className={showRightScroll ? 'visible' : ''}
          >
            <ChevronRight />
          </ScrollButton>
        </TabsWrapper>
      </Header>
      <ContentArea key={activeKey}>
        {activeTab?.content}
      </ContentArea>
    </Container>
  );
};

export default TaskMain;
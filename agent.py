from langgraph.prebuilt import create_react_agent
from langgraph.store.memory import InMemoryStore
from langmem import create_manage_memory_tool, create_search_memory_tool

store = InMemoryStore()

agent = create_react_agent(
    "anthropic:claude-3-5-sonnet-latest",
    tools=[
        create_manage_memory_tool(namespace=("memories",)),
        create_search_memory_tool(namespace=("memories",)),
    ],
    store=store,
)

agent.invoke({
    "messages": [{"role": "user", "content": "Remember I build paragliding websites"}]
})

response = agent.invoke({
    "messages": [{"role": "user", "content": "What do you know about me?"}]
})

print(response["messages"][-1].content)
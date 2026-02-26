---
title: ChatGPT Prompt Engineering for Developers
category: Prompt Engineering
publishedAt: 2023.04.29
---

最近吴恩达老师联合OpenAI开设了一门关于**Prompt Engineering**的简短课程（仅1.5h）：chatgpt-prompt-engineering-for-developers，旨在帮助大家在短时间内快速掌握提示词工程最佳实践技巧以及如何基于LLM构建智能AI聊天机器人。

课程链接：[https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/ "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/")

这个课程官网上标注的是**暂时免费**，并提供了可运行的jupyter notebook，可以一边看视频（英文字幕），一边修改代码、prompt进行实践，无需ChatGPT的api key，环境已经内置了。

B站上也有中文字幕版本的，搜一下就能看到了，可以两边一起配合食用。

本篇文章是学习过程中的一些简单笔记，**由于知识点不是特别多，因此主要还是以官网上的prompt代码为主**。

通过该课程，你可以学会：

- 学习软件开发的提示词的最佳实践以及一些常用的案例（摘要、推断、转换、扩展）
- 使用LLM构建聊天机器人
- 激发对新应用的想象力

## 1、两类大语言模型（LLM）

- **基础LLM**：基于文本训练数据（互联网上的大量数据）来预测做“文字接龙”
- **指令调整LLM（Instruction Tuned LLM）**：遵循指示的培训。指令调整LLM是在基础LLM上，使用输入和输出的指令进行**微调**。通常使用RLHF（人类反馈强化学习）技术进一步优化，使系统能够更好的遵循指令，使得输出的内容更加helpful、honest、harmless。

网上的例子可能更加适合基础LLM，**但是想要在生产应用中使用，还是得使用指令微调LLM。**

## 2、有效编写提示词的两大关键原则

在下面的笔记中，会涉及到一些prompt和代码，所以想要更好的实践内容，可以先搭建如下环境。

- 安装openai：`pip install openai`
- 导入jupyter并定义一个方法，允许轻松获取ChatGPT的返回值。

```python 
import openai
openai.api_key = "sk-" # 填写你的api key
model = "gpt-3.5-turbo"

def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{
        "role": "user",
        "content": prompt
    }]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0,
    )
    return response.choices[0].message["content"]


# test demo
print(get_completion("hello, who are you?"))
# output
# I am an AI language model created by OpenAI. How can I assist you today?
```


### 2.1、两大原则

- 编写**明确**、**具体**的指令：clear ≠ short；明确的指令将指导模型朝所需的方向输出。
  - **使用分隔符清楚的指示输入的不同部分。**比如使用分隔符（\`\`\`, """, < >, `<tag> </tag>`, `:`）区分指令和待处理的文本。可避免提示词与待处理文本冲突。
  ```python 
  text = f"""
  You should express what you want a model to do by \ 
  providing instructions that are as clear and \ 
  specific as you can possibly make them. \ 
  This will guide the model towards the desired output, \ 
  and reduce the chances of receiving irrelevant \ 
  or incorrect responses. Don't confuse writing a \ 
  clear prompt with writing a short prompt. \ 
  In many cases, longer prompts provide more clarity \ 
  and context for the model, which can lead to \ 
  more detailed and relevant outputs.
  """
  prompt = f"""
  Summarize the text delimited by triple backticks \ 
  into a single sentence.
  ```{text}```
  """
  print(get_completion(prompt))

  ```

  - **要求结构化输出。**即在prompt的末尾要求GPT以json或者html的形式输出。
  ```python 
  prompt = f"""
  Generate a list of three made-up book titles along \ 
  with their authors and genres. 
  Provide them in  JSON format  with the following keys: 
  book_id, title, author, genre.
  """
  print(get_completion(prompt))
  ```

  - **要求模型模型检查是否满足条件。**
  ```python 
  text_1 = f"""
  Making a cup of tea is easy! First, you need to get some \ 
  water boiling. While that's happening, \ 
  grab a cup and put a tea bag in it. Once the water is \ 
  hot enough, just pour it over the tea bag. \ 
  Let it sit for a bit so the tea can steep. After a \ 
  few minutes, take out the tea bag. If you \ 
  like, you can add some sugar or milk to taste. \ 
  And that's it! You've got yourself a delicious \ 
  cup of tea to enjoy.
  """

  prompt = f"""
  You will be provided with text delimited by triple quotes. 
  If it contains a sequence of instructions, \ 
  re-write those instructions in the following format:

  Step 1 - ...
  Step 2 - …
  …
  Step N - …

  If the text does not contain a sequence of instructions, \ 
  then simply write \"No steps provided.\"

  \"\"\"{text_1}\"\"\"
  """
  print(get_completion(prompt))

  ```

  - **少量训练提示。**比如在prompt中给一些对话任务，然后让GPT完成该对话。（比较适合写小说的场景）
  ```python 
  prompt = f"""
  Your task is to answer in a consistent style.

  <child>: Teach me about patience.

  <grandparent>: The river that carves the deepest \ 
  valley flows from a modest spring; the \ 
  grandest symphony originates from a single note; \ 
  the most intricate tapestry begins with a solitary thread.

  <child>: Teach me about resilience.
  """
  print(get_completion(prompt))

  ```

- 给模型足够的时间思考：简而言之就是通过指令调整多训练一会模型，让模型输出能够让你满意。
  - 指定完成任务所需要的步骤。
  ```python 
  text = f"""
  In a charming village, siblings Jack and Jill set out on \ 
  a quest to fetch water from a hilltop \ 
  well. As they climbed, singing joyfully, misfortune \ 
  struck—Jack tripped on a stone and tumbled \ 
  down the hill, with Jill following suit. \ 
  Though slightly battered, the pair returned home to \ 
  comforting embraces. Despite the mishap, \ 
  their adventurous spirits remained undimmed, and they \ 
  continued exploring with delight.
  """
  # example 1
  prompt_1 = f"""
  Perform the following actions: 
  1 - Summarize the following text delimited by triple \
  backticks with 1 sentence.
  2 - Translate the summary into French.
  3 - List each name in the French summary.
  4 - Output a json object that contains the following \
  keys: french_summary, num_names.

  Separate your answers with line breaks.

  Text:
  ```{text}```
  """
  print(get_completion(prompt_1))

  ```

  - 指示模型在匆忙做出结论之前思考解决方案。
  ```python 
  prompt = f"""
  Determine if the student's solution is correct or not.

  Question:
  I'm building a solar power installation and I need \
   help working out the financials. 
  - Land costs $100 / square foot
  - I can buy solar panels for $250 / square foot
  - I negotiated a contract for maintenance that will cost \ 
  me a flat $100k per year, and an additional $10 / square \
  foot
  What is the total cost for the first year of operations 
  as a function of the number of square feet.

  Student's Solution:
  Let x be the size of the installation in square feet.
  Costs:
  1. Land cost: 100x
  2. Solar panel cost: 250x
  3. Maintenance cost: 100,000 + 100x
  Total cost: 100x + 250x + 100,000 + 100x = 450x + 100,000
  """
  print(get_completion(prompt))

  ```


### 2.2、模型限制

- ChatGPT的幻觉：根据晦涩难懂的prompt，编造一个**不真实的**，**但却极其逼真**的内容。
- 减少幻觉的策略：要求模型从文本中找到任何相关的引用，并要求模型根据引用来回答问题。追溯答案并回源文档可以帮助减少这些幻觉。

## 3、提示词的迭代开发

- 提示词的开发是一个**迭代**过程。
- 基于第2章节的提示，先写一份prompt，看看输出结果如何。
- 然后逐步根据用户、产品需求逐步改进prompt（为提示词添加更多的产品或需求描述内容），以更接近所需的结果。
- 提示词工程师的关键并不在于知道多少个“完美提示词”，而在于他**对产品的了解程度，对用户需求的了解程度，并将这种了解转化成prompt、转化成训练ChatGPT的指令。**

## 4、摘要

- 描述任务：总结一段文本，生成一段更加简短的内容
- 描述边界：
  - 生成内容的单词数、句子数、字符数
  - 生成内容被应用在哪个方面
  - 生成内容更加聚焦于哪些属性
  - 生成内容的适用人群
- 描述待处理文本
- 以上步骤通过分隔符（换行符）分割

```python 
prod_review = """
Got this panda plush toy for my daughter's birthday, \
who loves it and takes it everywhere. It's soft and \ 
super cute, and its face has a friendly look. It's \ 
a bit small for what I paid though. I think there \ 
might be other options that are bigger for the \ 
same price. It arrived a day earlier than expected, \ 
so I got to play with it myself before I gave it \ 
to her.
"""

# 单词数、句子数、字符数
prompt=f"""
Your task is to generate a short summary of a product \
review from an ecommerce site.

Summarize the review below, delimited by triple \ 
backticks, in  at most 30 words .

Review: ```{prod_review}```
"""
print(get_completion(prompt))

# 生成内容被应用在哪个方面
prompt = f"""
Your task is to generate a short summary of a product \
review from an ecommerce site to give  feedback to the \
Shipping deparmtment . 

Summarize the review below, delimited by triple 
backticks, in at most 30 words, and  focusing on any aspects \
that mention shipping and delivery of the product . 

Review: ```{prod_review}```
"""
print(get_completion(prompt))

# 生成内容更加聚焦于哪些属性
prompt = f"""
Your task is to generate a short summary of a product \
review from an ecommerce site to give  feedback to the \
pricing deparmtment , responsible for determining the \
 price of the product .  

Summarize the review below, delimited by triple 
backticks, in at most 30 words, and  focusing on any aspects \
that are relevant to the price and perceived value . 

Review: ```{prod_review}```
"""
print(get_completion(prompt))

```


## 5、推理

推理是模型以文本作为输入，并执行某种分析的任务。可能是提取标签、名称，理解文本情感等方面的任务。

传统深度学习需要针对不同类型的任务去单独训练部署不同模型。LLM只需要你编写prompt即可生成结果，只是用一个模型，一个API来完成许多不同的任务。

待处理文本。

```python 
lamp_review = """
Needed a nice lamp for my bedroom, and this one had \
additional storage and not too high of a price point. \
Got it fast.  The string to our lamp broke during the \
transit and the company happily sent over a new one. \
Came within a few days as well. It was easy to put \
together.  I had a missing part, so I contacted their \
support and they very quickly got me the missing piece! \
Lumina seems to me to be a great company that cares \
about their customers and products!!
"""
```


### 5.1、情感分析

根据文本内容分析用户对产品的情感。

```python 
prompt = f"""
What is the sentiment of the following product review, 
which is delimited with triple backticks?

Review text: '''{lamp_review}'''
"""
print(get_completion(prompt))

```


添加指令，让回答更加简洁。

```python 
prompt = f"""
What is the sentiment of the following product review, 
which is delimited with triple backticks?

 Give your answer as a single word, either "positive" \
or "negative". 

Review text: '''{lamp_review}'''
"""
print(get_completion(prompt))
```


### 5.2、提取情感关键词

使用指令，提取用户评论中的情感关键词。

```python 
prompt = f"""
 Identify a list of emotions  that the writer of the \
following review is expressing. Include no more than \
five items in the list. Format your answer as a list of \
lower-case words separated by commas.

Review text: '''{lamp_review}'''
"""
print(get_completion(prompt))
```


### 5.3、情感分类

通过指令，对用户情感进行分类。

```python 
prompt = f"""
Is the writer of the following review expressing anger?\
The review is delimited with triple backticks. \
Give your answer as either yes or no.

Review text: '''{lamp_review}'''
"""
print(get_completion(prompt))

```


### 5.4、提取关键信息

类似提取情感关键词，通过指定特殊单词提取关键信息。

```python 
prompt = f"""
Identify the following items from the review text: 
- Item purchased by reviewer
- Company that made the item

The review is delimited with triple backticks. \
Format your response as a JSON object with \
"Item" and "Brand" as the keys. 
If the information isn't present, use "unknown" \
as the value.
Make your response as short as possible.
  
Review text: '''{lamp_review}'''
"""
print(get_completion(prompt))

```


### 5.5、合并多任务

将多个任务合并成单个任务，在一个prompt中提交。

通过列表的形式分隔多个任务，通过json的形式返回。

```python 
prompt = f"""
Identify the following items from the review text: 
- Sentiment (positive or negative)
- Is the reviewer expressing anger? (true or false)
- Item purchased by reviewer
- Company that made the item

The review is delimited with triple backticks. \
Format your response as a JSON object with \
"Sentiment", "Anger", "Item" and "Brand" as the keys.
If the information isn't present, use "unknown" \
as the value.
Make your response as short as possible.
Format the Anger value as a boolean.

Review text: '''{lamp_review}'''
"""
print(get_completion(prompt))

```


### 5.6、提取主题

```python 
prompt = f"""
 Determine five topics  that are being discussed in the \
following text, which is delimited by triple backticks.

Make each item one or two words long. 

Format your response as a list of items separated by commas.

Text sample: '''{story}'''
"""
print(get_completion(prompt))

```


## 6、转换

ChatGPT 使用多种语言的资源进行训练。这使模型能够进行翻译。以下是如何使用此功能的一些示例。

### 6.1、简单语言转换

```python 
prompt = f"""
Translate the following English text to Spanish: \ 
```Hi, I would like to order a blender```
"""
print(get_completion(prompt))

```


### 6.2、语言鉴别

```python 
prompt = f"""
Tell me which language this is: 
```Combien coûte le lampadaire?```
"""
print(get_completion(prompt))

```


### 6.3、多语翻译

```python 
prompt = f"""
Translate the following  text to French and Spanish
and English pirate: \
```I want to order a basketball```
"""
print(get_completion(prompt))

```


### 6.4、格式转换

比如将比较口语的话转换成书信格式。

```python 
prompt = f"""
Translate the following from slang to a business letter: 
'Dude, This is Joe, check out this spec on this standing lamp.'
"""
print(get_completion(prompt))

```


### 6.5、代码转换

```python 
data_json = { "resturant employees" :[ 
    {"name":"Shyam", "email":"shyamjaiswal@gmail.com"},
    {"name":"Bob", "email":"bob32@gmail.com"},
    {"name":"Jai", "email":"jai87@gmail.com"}
]}
prompt = f"""
Translate the following python dictionary from JSON to an HTML \
table with column headers and title: {data_json}
"""
response = get_completion(prompt)
print(response)

from IPython.display import display, Markdown, Latex, HTML, JSON
display(HTML(response))

```


### 6.6、拼写检查、语法检查

这里有一些常见的语法和拼写问题的例子以及LLM针对这些问题的答复。

如果想让LLM对你的文本进行拼写检查或者语法检查，你可以添加这些指令：“校对”或者“校对并更正”。

```python 
text = [ 
  "The girl with the black and white puppies have a ball.",  # The girl has a ball.
  "Yolanda has her notebook.", # ok
  "Its going to be a long day. Does the car need it’s oil changed?",  # Homonyms
  "Their goes my freedom. There going to bring they’re suitcases.",  # Homonyms
  "Your going to need you’re notebook.",  # Homonyms
  "That medicine effects my ability to sleep. Have you heard of the butterfly affect?", # Homonyms
  "This phrase is to cherck chatGPT for speling abilitty"  # spelling
]
for t in text:
    prompt = f"""Proofread and correct the following text
    and rewrite the corrected version. If you don't find
    and errors, just say "No errors found". Don't use 
    any punctuation around the text:
    ```{t}```"""
    response = get_completion(prompt)
    print(response)
```


## 7、扩展

Expanding（扩展）是指将短文本（如一组说明或主题列表）通过大语言模型转化成更长的文本（如一封电子邮件或是一篇关于某个主题的文章）。

适用场景：头脑风暴。

### 7.1、根据邮件内容自动回复

邮件内容：

```python 
# given the sentiment from the lesson on "inferring",
# and the original customer message, customize the email
sentiment = "negative"

# review for a blender
review = f"""
So, they still had the 17 piece system on seasonal \
sale for around $49 in the month of November, about \
half off, but for some reason (call it price gouging) \
around the second week of December the prices all went \
up to about anywhere from between $70-$89 for the same \
system. And the 11 piece system went up around $10 or \
so in price also from the earlier sale price of $29. \
So it looks okay, but if you look at the base, the part \
where the blade locks into place doesn’t look as good \
as in previous editions from a few years ago, but I \
plan to be very gentle with it (example, I crush \
very hard items like beans, ice, rice, etc. in the \ 
blender first then pulverize them in the serving size \
I want in the blender then switch to the whipping \
blade for a finer flour, and use the cross cutting blade \
first when making smoothies, then use the flat blade \
if I need them finer/less pulpy). Special tip when making \
smoothies, finely cut and freeze the fruits and \
vegetables (if using spinach-lightly stew soften the \ 
spinach then freeze until ready for use-and if making \
sorbet, use a small to medium sized food processor) \ 
that you plan to use that way you can avoid adding so \
much ice if at all-when making your smoothie. \
After about a year, the motor was making a funny noise. \
I called customer service but the warranty expired \
already, so I had to buy another one. FYI: The overall \
quality has gone done in these types of products, so \
they are kind of counting on brand recognition and \
consumer loyalty to maintain sales. Got it in about \
two days.
"""
```


prompt：

- 首先赋予GPT一个角色
- 告诉具体任务目标
- 根据邮件表达的不同情感，回复不同内容
- 通过指令描述具体的语气
- 通过分隔符区分prompt和email

```python 
prompt = f"""
You are a customer service AI assistant.
Your task is to send an email reply to a valued customer.
Given the customer email delimited by ```, \
Generate a reply to thank the customer for their review.
If the sentiment is positive or neutral, thank them for \
their review.
If the sentiment is negative, apologize and suggest that \
they can reach out to customer service. 
Make sure to use specific details from the review.
Write in a concise and professional tone.
Sign the email as `AI customer agent`.
Customer review: ```{review}```
Review sentiment: {sentiment}
"""
print(get_completion(prompt))
```


### 7.1、Temperature

添加temperature：

- temp为模型的探索程度或随机性，temp越高，越有可能回复不同、甚至偏离本意的答案。
- 如果想要构建一个可靠、可预测的系统，应该设置temp=0。
- 如果想要获得更加有创意的、更加广泛的答案，可以设置更高的temp。

```python 
prompt = f"""
You are a customer service AI assistant.
Your task is to send an email reply to a valued customer.
Given the customer email delimited by ```, \
Generate a reply to thank the customer for their review.
If the sentiment is positive or neutral, thank them for \
their review.
If the sentiment is negative, apologize and suggest that \
they can reach out to customer service. 
Make sure to use specific details from the review.
Write in a concise and professional tone.
Sign the email as `AI customer agent`.
Customer review: ```{review}```
Review sentiment: {sentiment}
"""
print(get_completion(prompt,  temperature=0.7 ))
```


## 8、构建聊天机器人

首先，我们需要构造环境。

- 添加openai的lib，设置api key
- 定义两个快速打印响应结果的函数，其中一个函数允许添加temperature参数

```python 
import os
import openai
openai.api_key = "sk-" # 填写你的api key

openai.api_key  = os.getenv('OPENAI_API_KEY')

def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0,
    )
    return response.choices[0].message["content"]

def get_completion_from_messages(messages, model="gpt-3.5-turbo", temperature=0):
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature, # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]

```


构造对话消息：

- system：用于指示机器人的角色，会帮助ChatGPT以该角色的语气返回响应
- user：用户，表示使用ChatGPT的人
- assistant：表示ChatGPT

```python 
messages =  [  
{'role':'system', 'content':'You are an assistant that speaks like Shakespeare.'},    
{'role':'user', 'content':'tell me a joke'},   
{'role':'assistant', 'content':'Why did the chicken cross the road'},   
{'role':'user', 'content':'I don\'t know'}  ]

response = get_completion_from_messages(messages, temperature=1)
print(response)

```


其它的一些对话例子：

```python 
messages =  [  
{'role':'system', 'content':'You are friendly chatbot.'},    
{'role':'user', 'content':'Hi, my name is Isa'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)

messages =  [  
{'role':'system', 'content':'You are friendly chatbot.'},    
{'role':'user', 'content':'Yes,  can you remind me, What is my name?'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)

```


每次对话都是独立的，因此，想要让ChatGPT“拥有记忆力”，需要将先前的对话全部包含起来，也就是构造“**上下文**”对话，然后将上下文一起发送给ChatGPT。

```python 
messages =  [  
{'role':'system', 'content':'You are friendly chatbot.'},
{'role':'user', 'content':'Hi, my name is Isa'},
{'role':'assistant', 'content': "Hi Isa! It's nice to meet you. \
Is there anything I can help you with today?"},
{'role':'user', 'content':'Yes, you can remind me, What is my name?'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```


### 8.1、OrderBot代码

我们可以自动收集用户提示和助手响应以构建 OrderBot。 OrderBot 将在比萨餐厅接受订单。

```python 
def collect_messages(_):
    prompt = inp.value_input
    inp.value = ''
    context.append({'role':'user', 'content':f"{prompt}"})
    response = get_completion_from_messages(context) 
    context.append({'role':'assistant', 'content':f"{response}"})
    panels.append(
        pn.Row('User:', pn.pane.Markdown(prompt, width=600)))
    panels.append(
        pn.Row('Assistant:', pn.pane.Markdown(response, width=600, style={'background-color': '#F6F6F6'})))
 
    return pn.Column(*panels)


import panel as pn  # GUI
pn.extension()

panels = [] # collect display 

context = [ {'role':'system', 'content':"""
You are OrderBot, an automated service to collect orders for a pizza restaurant. \
You first greet the customer, then collects the order, \
and then asks if it's a pickup or delivery. \
You wait to collect the entire order, then summarize it and check for a final \
time if the customer wants to add anything else. \
If it's a delivery, you ask for an address. \
Finally you collect the payment.\
Make sure to clarify all options, extras and sizes to uniquely \
identify the item from the menu.\
You respond in a short, very conversational friendly style. \
The menu includes \
pepperoni pizza  12.95, 10.00, 7.00 \
cheese pizza   10.95, 9.25, 6.50 \
eggplant pizza   11.95, 9.75, 6.75 \
fries 4.50, 3.50 \
greek salad 7.25 \
Toppings: \
extra cheese 2.00, \
mushrooms 1.50 \
sausage 3.00 \
canadian bacon 3.50 \
AI sauce 1.50 \
peppers 1.00 \
Drinks: \
coke 3.00, 2.00, 1.00 \
sprite 3.00, 2.00, 1.00 \
bottled water 5.00 \
"""} ]  # accumulate messages


inp = pn.widgets.TextInput(value="Hi", placeholder='Enter text here…')
button_conversation = pn.widgets.Button(name="Chat!")

interactive_conversation = pn.bind(collect_messages, button_conversation)

dashboard = pn.Column(
    inp,
    pn.Row(button_conversation),
    pn.panel(interactive_conversation, loading_indicator=True, height=300),
)

dashboard


messages =  context.copy()
messages.append(
{'role':'system', 'content':'create a json summary of the previous food order. Itemize the price for each item\
 The fields should be 1) pizza, include size 2) list of toppings 3) list of drinks, include size   4) list of sides include size  5)total price '},    
)
 #The fields should be 1) pizza, price 2) list of toppings 3) list of drinks, include size include price  4) list of sides include size include price, 5)total price '},    

response = get_completion_from_messages(messages, temperature=0)
print(response)

```


## 9、总结

prompt编写原则：

- 编写清晰明确的指示
- 给模型一些思考时间

prompt的开发是迭代式的，我们需要根据LLM的反馈不断迭代提示词。

LLM的应用场景：总结、推理、转化、、扩展。

如何构建自定义机器人。

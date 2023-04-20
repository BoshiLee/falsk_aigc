from utils.config import Config
import openai

openai.api_key = Config().openai_api_key


def ask_openai(messages, mak_tokens=300):
    response = openai.ChatCompletion.create(model=Config().model,
                                            messages=messages,
                                            max_tokens=mak_tokens,
                                            temperature=0.5,
                                            stream=True,
                                            )
    response_str = response.choices[0].message.content.strip()
    return str(response_str)


def ask_openai_realtime(messages, max_tokens=300, temperature=0.5):
    response = openai.ChatCompletion.create(model=Config().model,
                                            messages=messages,
                                            max_tokens=max_tokens,
                                            temperature=temperature,
                                            stream=True,
                                            )
    for chunk in response:
        if "choices" in chunk:
            choice = chunk.choices[0]
            if choice.finish_reason == "stop":
                return
            elif "content" in choice.delta:
                piece = choice.delta.content
                yield piece

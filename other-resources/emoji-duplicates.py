# a = [1,2,3,2,1,5,6,5,5,5]

# seen = set()
# uniq = []
# for x in a:
#     if x not in seen:
#         uniq.append(x)
#         seen.add(x)

# print(uniq)

import json

# with open('../static/') as fp:
#     ds = json.load(fp) #this file contains the json

with open('../static/script/emoji_.json', encoding='UTF-8') as file:
    emoji_data = json.load(file)

mem = {}

for record in emoji_data:
    name = record["name"]
    if name not in mem:
        mem[name] = record

print(mem)
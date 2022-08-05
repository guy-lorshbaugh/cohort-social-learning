my_list = [
    { "name": "andy",
      "age": "23",
      "hair_color": "blue"
    },
    { "name": "carlita",
      "age": "43",
      "hair_color": "blonde with purple streaks"
    },
    { "name": "lena",
      "age": "30",
      "hair_color": "neon pink yo"
    }]

def hairColor(item):
  return item.hair_color

colors_for = [d['hair_color'] for d in my_list]

colors_map = map(hairColor, my_list)

print(colors_for)

print(colors_map)

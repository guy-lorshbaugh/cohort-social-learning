import models

import logging
logger = logging.getLogger('peewee')
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.DEBUG)


def get_tags(id):
    tags = (models.Tags
        .select()
        .join(models.EntryTags)
        .join(models.Entry)
        .where(models.Entry.id == id)
        .order_by(models.Tags.tag)
        )
    return tags


# query = (models.Entry
#             .select()
#             .join(models.EntryTags)
#             .join(models.Tags)
#             .where(models.EntryTags.tag_id == 2)
# )

# for item in query:
#     print(f"""
#     {item.date.strftime('%B %d %I:%M %p')}
    
# {item.learned}


#         """)

word = models.User.get(models.User.id==1)
print(word.password)
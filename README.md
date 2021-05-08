# Blog plugin
Extension that allows to manage store together with a blog from one place.

## API
Plugin exposes endpoints:
* `GET /vendor/blog/category/:categoryId` - returns a single blog category
* `GET /vendor/blog/post/category/:categoryId` - returns posts for a category
* `GET /vendor/blog` - returns list of blog entries
* `GET /vendor/blog/:blogEntryId` - returns single blog entry

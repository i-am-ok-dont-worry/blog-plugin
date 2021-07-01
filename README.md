# Blog plugin
Extension that allows to manage store together with a blog from one place.

## API
Plugin exposes endpoints:
* `GET /vendor/blog` - returns list of blog entries
* `GET /vendor/blog/:blogEntryId` - returns single blog entry
* `GET /vendor/blog/category/list` - returns a list of blog categories 
* `GET /vendor/blog/category/:categoryId` - returns a single blog category
* `GET /vendor/blog/post/category/:categoryId` - returns posts for a category

## Searching blog posts
`GET /vendor/blog` endpoint accepts [SearchQuery](https://gitlab.grupakmk.pl/internal/frontend/api/lib/libstorefront/-/blob/development/src/search/types/search-query.ts) as a optional query parameter.
Query must be a stringified valid `SearchQuery` object. It is lately transformed to a 
Magento [SearchCriteria](https://devdocs.magento.com/guides/v2.4/extension-dev-guide/searching-with-repositories.html)
object.

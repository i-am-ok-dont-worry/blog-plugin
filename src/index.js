const SearchCriteria = require('magento-searchcriteria-builder');

module.exports = ({ config, db, router, cache, apiStatus, apiError, getRestApiClient }) => {
    const createMage2RestClient = () => {
        const client = getRestApiClient();
        client.addMethods('blog', (restClient) => {
            const module = {};

            module.getCategories = () => {
              return restClient.get(`/blog/category/list`);
            };

            module.getCategory = ({ categoryId }) => {
              return restClient.get(`/blog/category/${categoryId}`);
            };

            module.getBlogEntriesForCategory = ({ categoryId }) => {
              return restClient.get(`/blog/post/category/${categoryId}`);
            };

            module.getBlogEntries = () => {
                const searchCriteria = new SearchCriteria();
                searchCriteria.applyFilter('status', '2', 'eq');
              return restClient.get(`/blog/search?` + searchCriteria.build());
            };

            module.searchBlogEntries = (query) => {
                const searchCriteria = SearchCriteria.buildFromSearchQuery(query);
                return restClient.get('/blog/search?' + searchCriteria.build());
            };

            module.getSingleBlogEntry = ({ blogEntryId }) => {
              return restClient.get(`/blog/${blogEntryId}`);
            };

            return module;
        });

        return client;
    };

    router.get('/category/list', (req, res) => {
      const client = createMage2RestClient();
      try {
        client.blog.getCategories()
          .then(response => apiStatus(res, response, 200))
          .catch(err => {
            apiError(res, err);
          });
      } catch (e) {
        apiError(res, e);
      }
    });

    router.get('/category/:categoryId', (req, res) => {
      const { categoryId } = req.params;
      const client = createMage2RestClient();
      try {
        client.blog.getCategory({ categoryId })
          .then(response => apiStatus(res, response, 200))
          .catch(err => {
            apiError(res, err);
          });
      } catch (e) {
        apiError(res, e);
      }
    });

    router.get('/post/category/:categoryId', (req, res) => {
      const { categoryId } = req.params;
      const client = createMage2RestClient();
      try {
        client.blog.getBlogEntriesForCategory({ categoryId })
          .then(response => apiStatus(res, response, 200))
          .catch(err => {
            apiError(res, err);
          });
      } catch (e) {
        apiError(res, e);
      }
    });

    /**
     * Returns list of blog entries
     * @req.query.storeCode
     */
    router.get('/', (req, res) => {
        const client = createMage2RestClient();
        const { request } = req.query;
        try {
            if (request) {
                client.blog.searchBlogEntries(request)
                    .then(response => {
                        apiStatus(res, response, 200);
                    })
                    .catch(err => {
                        apiError(res, err);
                    });
            } else {
                client.blog.getBlogEntries()
                    .then(response => {
                        if (response) {
                            apiStatus(res, response.items, 200);
                        }
                    })
                    .catch(err => {
                        apiError(res, err);
                    });
            }
        } catch (e) {
            apiError(res, e);
        }
    });

    /**
     * Returns single blog entry
     * @req.query.storeCode
     */
    router.get('/:blogEntryId', (req, res) => {
        const { blogEntryId } = req.params;
        const client = createMage2RestClient();
        try {
            client.blog.getSingleBlogEntry({ blogEntryId })
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    return {
        domainName: '@grupakmk',
        pluginName: 'blog-plugin',
        route: '/blog',
        router
    };
};

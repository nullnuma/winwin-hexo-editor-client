export default function () {
  return {
    data: {
      article: null,
      articles: {},
      categories: {},
      tags: {}
    },
    status: {
      saved: true,
      lastSavedAt: null,
      loading: true,
      ready: false
    },
    restrictedkeys: {
      post: [],
      page: []
    }
  }
}

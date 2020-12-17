#!/bin/bash
BRANCH=$1
curl -u "rrooij:$BINTRAY_API_TOKEN" "https://api.bintray.com/npm/terminusdb/npm-$BRANCH/auth" > .npmrc
curl -XDELETE "https://api.bintray.com/packages/terminusdb/npm-$BRANCH/terminusdb:terminusdb-react-components" -u "rrooij:$BINTRAY_API_TOKEN"
npm publish
curl -T "dist/terminusdb-react-components.min.js" -u"rrooij:$BINTRAY_API_TOKEN" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-react-components/$BRANCH/$BRANCH/terminusdb-react-components.min.js?publish=1&override=1"
curl -T "dist/terminusdb-d3-graph.min.js" -u"rrooij:$BINTRAY_API_TOKEN" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-react-components/$BRANCH/$BRANCH/terminusdb-d3-graph.min.js?publish=1&override=1"
curl -T "dist/terminusdb-react-components-main.css" -u"rrooij:$BINTRAY_API_TOKEN" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-react-components/$BRANCH/$BRANCH/terminusdb-react-components-main.css?publish=1&override=1"

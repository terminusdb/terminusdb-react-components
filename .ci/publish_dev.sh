#!/bin/bash
echo "\
registry=https://api.bintray.com/npm/terminusdb/npm-dev
_auth=$BINTRAY_TOKEN
always-auth=true
email=robin@datachemist.com" > $TRAVIS_BUILD_DIR/.npmrc
curl -XDELETE -u"rrooij:$BINTRAY_CURL_TOKEN" "https://api.bintray.com/packages/terminusdb/npm-dev/terminusdb:terminusdb-react-components"
npm publish
curl -T "dist/terminusdb-react-components.min.js" -u"rrooij:$BINTRAY_CURL_TOKEN" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-react-components/dev/dev/terminusdb-react-components.min.js?publish=1&override=1"
curl -T "dist/terminusdb-d3-graph.min.js" -u"rrooij:$BINTRAY_CURL_TOKEN" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-react-components/dev/dev/terminusdb-d3-graph.min.js?publish=1&override=1"
curl -T "dist/terminusdb-react-components-main.css" -u"rrooij:$BINTRAY_CURL_TOKEN" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-react-components/dev/dev/terminusdb-react-components-main.css?publish=1&override=1"

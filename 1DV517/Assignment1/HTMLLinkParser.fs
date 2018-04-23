module HTMLLinkParser

open System
open System.IO
open System.Text.RegularExpressions

type HrefTag = {Original:string; Full:string; Javascript:string; URL:string; Protocol:string; Id:string}

// Group 1: Full href match
// Group 2: Javascript match
// Group 3: URL match
// Group 4: Protocol match
// Group 5: query match
// Group 6: Percent escaped character
// Group 7: Percent escaped character
// Group 8: Id match
let regex = """<a href="((javascript:[a-zA-Z0-9_.,\/()'\=\-\+\;\:\?\&\*\\\{\}\[\]\<\>\!\% ]*)|(([a-zA-Z0-9_.\/]*:)?[a-zA-Z0-9_.\/]*(\?([a-zA-Z0-9_.\/\-\=\&]|(\%\d+))*)?)(#[a-zA-Z0-9_.\/-]*)?)">[a-zA-Z0-9_.\/]*<\/a>"""

let (|Regex|_|) pattern input =
        let m = Regex.Match(input, pattern)
        if m.Success then Some(List.tail [ for g in m.Groups -> g.Value ])
        else None

let testData = 
    [
        "<a href=\"something.aspx\">Test</a>";
        "<a href=\"something.aspx#some-anchor\">Test</a>";
        "<a href=\"something.aspx?some-query-string=value&other-thing=value&thing=%20\">Test</a>";
        "<a href=\"http://www.example.com/something.aspx\">Test</a>";
        "<a href=\"javascript:something('Hello')\">Title</a>";
        "<a href=\"#some-anchor\">Title</a>";
        "<a href=\"http://www.example.com/something.aspx#some-anchor\">Test</a>";
        "<a href=\"javascript:alert('Hello');\">Test</a>";
        "<a href=\"javascript:someFunction();\">Test</a>";
        "<a href=\"javascript:;\">Test</a>";
        "<a href=\"javascript:function() {var x = 0; return false;} return false\">Test</a>";
        "<a href=\"file:www.example.com/somefile.txt\">Test</a>";
        "<a href=\"ftp://www.example.com/\">Test</a>";
    ]

let parseHtmlLines (input : string list) =
    [for x in input do
        match x with
        | Regex regex [full; javascript; url; protocol; query; percent1; percent2; id] ->
            // If the regex parsed a protocol we remove the trailing ':' from the protocol string.
            let strippedProtocol = if (protocol <> String.Empty) then protocol.Substring(0, protocol.Length - 1) else String.Empty
            let hrefTag = {Original=x; Full=full; Javascript=javascript; URL=url; Protocol=strippedProtocol; Id=id}
            yield hrefTag
        | _ -> ()
    ]

let printHrefTags (input : HrefTag list) =
    for x in input do
        printf "Parsed line: %s " (x.Original)
        if (x.Javascript <> String.Empty) then printf "Javascript: %s " (x.Javascript)
        if (x.URL <> String.Empty) then printf "URL: %s " (x.URL)
        if (x.Protocol <> String.Empty) then printf "Protocol: %s " (x.Protocol)
        if (x.Id <> String.Empty) then printf "Id: %s " (x.Id)
        printfn ""

[<EntryPoint>]
let main args =
    let path = args.[0]
    let lines = File.ReadLines(path)
    Seq.toList lines |> parseHtmlLines |> printHrefTags

    // Return 0. This indicates success.
    0
/* Script to create LaTeX code from the form elements on the page. */

function createLatex() {
    var pageSelectionStr = prompt('Please select pages ("1-2,4" or leave empty to create all pages):', '');
    if ( pageSelectionStr == null ) {
        return;
    }
    var selectedPages = parsePrintPageSelection(pageSelectionStr);

    var latexItems = [];
    var pages = Array.from( document.getElementsByClassName('page') );
    var ratioPxToCm = 21 / pages[0].getBoundingClientRect().height; // A4 Landscape(!)

    var latexPageCounter = 1;
    for ( let page of pages ) {
        // BASE PDF PAGE INCLUDE
        var pageNum = pages.indexOf(page) + 1;

        if ( selectedPages.size > 0 && !selectedPages.has(pageNum) ) {
            continue;
        }

        latexItems.push( '\\begin{figure}[H]\n' );
        latexItems.push( `\\centering\\includegraphics[page=${latexPageCounter},width=\\textwidth]{base.pdf}\n` );
        latexItems.push( '\\end{figure}\n' );

        // FIELDS
        var fields = page.querySelectorAll('.field');
        for ( let field of fields ) {
            var bbox = getAbsPosRelTo( field, page, ratioPxToCm );

            var name = field.getAttribute('name');
            var _maxlen = field.getAttribute('maxlength');
            var maxlen = _maxlen ? `\\MaxLen{${_maxlen}}` : ''; // [\MaxLen{...}]
            var align = field.classList.contains("digit") || field.classList.contains("center") ? '\\Q{1}' : '\\Q{0}'; // [\Q{...}] // 0=l,1=c,2=r

            var x = bbox.x;
            var y = bbox.y;
            var width = bbox.width;
            var height = bbox.height;

            var textFieldTemplate = `\\begin{textblock}{0}(${x},${y})\\textField[${align}${maxlen}]{${name}}{${width}cm}{${height}cm}\\end{textblock}\n`;
            latexItems.push(textFieldTemplate);
        }

        // TEXTAREAS
        var textareas = page.querySelectorAll('.textarea');
        for ( let textarea of textareas ) {
            var bbox = getAbsPosRelTo( textarea, page, ratioPxToCm );

            var name = textarea.getAttribute('name');

            var x = bbox.x;
            var y = bbox.y;
            var width = bbox.width;
            var height = bbox.height;

            var textAreaTemplate = `\\begin{textblock}{0}(${x},${y})\\textField[\\Q{0}\\Ff{\\FfMultiline}]{${name}}{${width}cm}{${height}cm}\\end{textblock}\n`;
            latexItems.push(textAreaTemplate);
        }

        // CHECKBOXES
        var checkboxes = page.querySelectorAll('.checkbox');
        for ( let checkbox of checkboxes ) {
            var bbox = getAbsPosRelTo( checkbox, page, ratioPxToCm );

            var name = checkbox.getAttribute('name');

            var x = bbox.x;
            var y = bbox.y;
            var width = bbox.width;
            var height = bbox.height;

            var checkBoxTemplate = `\\begin{textblock}{0}(${x},${y})\\checkBox{${name}}{${width}cm}{${height}cm}{${name}on}\\end{textblock}\n`;
            latexItems.push(checkBoxTemplate);
        }

        if ( latexPageCounter <= pages.length ) {
            latexItems.push( '\\clearpage\n' );
        }

        latexPageCounter++;
    }

    var latex = [
        '\\documentclass[a4paper,landscape]{article}\n',
        '\\usepackage[margin=0pt]{geometry}\n',
        '\\usepackage[absolute]{textpos}\n',
        '\\usepackage{eforms}\n',
        '\\usepackage{graphicx}\n',
        '\\usepackage{float}\n',
        '\\usepackage{insdljs}\n',
        '\\usepackage{icon-appr}\n',
        '\\pagestyle{empty}\n',
        '\\setlength{\\parindent}{0pt}\n',
        '\\setlength{\\TPHorizModule}{1cm}\n',
        '\\setlength{\\TPVertModule}{1cm}\n',
        '\\everyTextField{\\BC{}\\BG{}\\W{0}\\Q{1}\\textSize{0}}\n',
        '\\everyCheckBox{\\symbolchoice{circle}\\W{0}}\n',
        '\\begin{document}\n',
        '\\begin{Form}\n',
        latexItems.join(''),
        '\\end{Form}\n',
        '\\end{document}\n'
    ].join('');

    download('a5charsheet_' + Date.now() + '.tex', latex);
}

function getAbsPosRelTo( elem, origin, ratioPxToCm ) {
    var offset = ratioPxToCm;
    var elemBB = elem.getBoundingClientRect();
    var originBB = origin.getBoundingClientRect();
    return {
        x: ( elemBB.left - originBB.left ) * ratioPxToCm + 2 * offset,
        y: ( elemBB.top - originBB.top) * ratioPxToCm + 2 * offset,
        width: elemBB.width * ratioPxToCm - 4 * offset,
        height: elemBB.height * ratioPxToCm - 4 * offset
    };
}

function download(filename, text) {
    var dlElem = document.createElement('a');
    dlElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    dlElem.setAttribute('download', filename);
    dlElem.style.display = 'none';
    document.body.appendChild(dlElem);
    dlElem.click();
    document.body.removeChild(dlElem);
}

function parsePrintPageSelection( str ) {
    var selectedPages = new Set();
    var ranges = str.split(',');
    for ( let range of ranges ) {
        var rangeParts = range.split('-').map(function(item){return parseInt(item);});
        if ( rangeParts.length == 1 ) {
            if ( !isNaN(rangeParts[0]) ) {
                selectedPages.add( rangeParts[0] );
            }
        } else if ( rangeParts.length == 2 ) {
            if ( !isNaN(rangeParts[0]) && !isNaN(rangeParts[1]) ) {
                for ( var i = rangeParts[0]; i <= rangeParts[1]; i++ ) {
                    selectedPages.add( i );
                }
            }
        }
    }
    return selectedPages;
}

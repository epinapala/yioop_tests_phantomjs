<?php
/**
 * SeekQuarry/Yioop --
 * Open Source Pure PHP Search Engine, Crawler, and Indexer
 * Copyright (C) 2009 - 2014  Chris Pollett chris@pollett.org
 * LICENSE:
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * END LICENSE
 *
 * @author Eswara Rajesh Pinapala epinapala@live.com
 * @package seek_quarry
 * @subpackage test
 * @license http://www.gnu.org/licenses/ GPL3
 * @link http://www.seekquarry.com/
 * @copyright 2009 - 2014
 * @filesource
 */

/**
 * Used to test the UI using PhantomJs.
 *
 * @author Eswara Rajesh Pinapala
 * @package seek_quarry
 * @subpackage test
 */
class PhantomjsUiTest extends JavascriptUnitTest
{
    /**
     * This test case runs the UI test cases in JS using PhantomJS. It then
     * sends the result JSON to Javascript land to render test results.
     */
    function UITestCase()
    {
        require_once 'YioopPhantomRunner.php';
        $yioop_phantom_runner = new YioopPhantomRunner();
        $test_results = ($yioop_phantom_runner->execute(
            "/Users/epinapala/yioop_tests/yiooptest.js",false));
        ?>
        <div id="UITest">
            <?php if(!$test_results){
                die("Unable to Run tests, Please try Debug mode.");
            }
            ?>
        </div>
        <script type="text/javascript">
            var results = <?php echo $test_results; ?>
            table = document.createElement('table');
            for (var key in results) {
                var test_result = results[key];
                var cell;
                var row;
                var table;
                var color;
                if(test_result.ack) {
                    color = 'lightgreen';
                } else {
                    color = 'red';
                }
                row = table.insertRow(0);
                cell = row.insertCell(0);
                cell.style.fontWeight = 'bold';
                cell.innerHTML = key;
                cell = row.insertCell(1);
                cell.setAttribute("style", "background-color: " + color + ";");
                cell.innerHTML = test_result.status;
                document.getElementById("UITest").appendChild(table);
            }
        </script>
    <?php
    }
}

?>

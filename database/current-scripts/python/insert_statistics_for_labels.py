__author__ = 'atlanmod'

import logging

import mysql.connector
from mysql.connector import errorcode
import numpy
from decimal import *


LOG_FILENAME = 'insert_statistics_for_labels.log'

CONFIG = {
    'user': 'root',
    'password': 'mifottogila',
    'host': 'atlanmodexp.info.emn.fr',
    'port': '13506',
    'database': "ghtorrent",
    'raise_on_warnings': False,
    'buffered': True
}


def create_table_label_statistics(cnx):
    cursor = cnx.cursor()
    query = "CREATE TABLE _label_statistics (" \
            "repo_id numeric(11), " \
            "label_id numeric(11), " \
            "label_name varchar(24), " \
            "hs_first_comment_lower_whisker decimal(10,2), " \
            "hs_first_comment_perc25th decimal(10,2), " \
            "hs_first_comment_perc50th decimal(10,2), " \
            "hs_first_comment_perc75th decimal(10,2), " \
            "hs_first_comment_upper_whisker decimal(10,2), " \
            "hs_first_comment_mean decimal(10,2), " \
            "hs_collab_response_lower_whisker decimal(10,2), " \
            "hs_collab_response_perc25th decimal(10,2), " \
            "hs_collab_response_perc50th decimal(10,2), " \
            "hs_collab_response_perc75th decimal(10,2), " \
            "hs_collab_response_upper_whisker decimal(10,2), " \
            "hs_collab_response_mean decimal(10,2), " \
            "issue_merge_time_hs_to_solve_lower_whisker decimal(10,2), " \
            "issue_merge_time_hs_to_solve_perc25th decimal(10,2), " \
            "issue_merge_time_hs_to_solve_perc50th decimal(10,2), " \
            "issue_merge_time_hs_to_solve_perc75th decimal(10,2), " \
            "issue_merge_time_hs_to_solve_upper_whisker decimal(10,2), " \
            "issue_merge_time_hs_to_solve_mean decimal(10,2), " \
            "issue_close_time_hs_to_solve_lower_whisker decimal(10,2), " \
            "issue_close_time_hs_to_solve_perc25th decimal(10,2), " \
            "issue_close_time_hs_to_solve_perc50th decimal(10,2), " \
            "issue_close_time_hs_to_solve_perc75th decimal(10,2), " \
            "issue_close_time_hs_to_solve_upper_whisker decimal(10,2), " \
            "issue_close_time_hs_to_solve_mean decimal(10,2), " \
            "pending_issue_age_lower_whisker decimal(10,2), " \
            "pending_issue_age_perc25th decimal(10,2), " \
            "pending_issue_age_perc50th decimal(10,2), " \
            "pending_issue_age_perc75th decimal(10,2), " \
            "pending_issue_age_upper_whisker decimal(10,2), " \
            "pending_issue_age_mean decimal(10,2), " \
            "num_merged numeric(11), " \
            "num_closed numeric(11), " \
            "num_pending numeric(11)," \
            "INDEX label_id (label_id), " \
            "INDEX repo_id (repo__id)" \
            ");"
    cursor.execute(query)
    cursor.close()


def insert_in_db(cnx, repo_id, label_id, label_name,
                 all_hs_first_comment_stats,
                 all_hs_collab_response,
                 all_issue_merge_time_hs_to_solve,
                 all_issue_close_time_hs_to_solve,
                 all_pending_issue_age,
                 count_resolution_info):
    cursor = cnx.cursor()
    query = "INSERT INTO _label_statistics VALUES " \
            "(%s, %s, %s, %s, %s, %s," \
            "%s, %s, %s, %s, %s, %s," \
            "%s, %s, %s, %s, %s, %s," \
            "%s, %s, %s, %s, %s, %s," \
            "%s, %s, %s, %s, %s, %s," \
            "%s, %s, %s, %s, %s, %s)"
    arguments = [repo_id, label_id, label_name,
                 all_hs_first_comment_stats[0], all_hs_first_comment_stats[1], all_hs_first_comment_stats[2],
                 all_hs_first_comment_stats[3], all_hs_first_comment_stats[4], all_hs_first_comment_stats[5],
                 all_hs_collab_response[0], all_hs_collab_response[1], all_hs_collab_response[2],
                 all_hs_collab_response[3], all_hs_collab_response[4], all_hs_collab_response[5],
                 all_issue_merge_time_hs_to_solve[0], all_issue_merge_time_hs_to_solve[1], all_issue_merge_time_hs_to_solve[2],
                 all_issue_merge_time_hs_to_solve[3], all_issue_merge_time_hs_to_solve[4], all_issue_merge_time_hs_to_solve[5],
                 all_issue_close_time_hs_to_solve[0], all_issue_close_time_hs_to_solve[1], all_issue_close_time_hs_to_solve[2],
                 all_issue_close_time_hs_to_solve[3], all_issue_close_time_hs_to_solve[4], all_issue_close_time_hs_to_solve[5],
                 all_pending_issue_age[0], all_pending_issue_age[1], all_pending_issue_age[2],
                 all_pending_issue_age[3], all_pending_issue_age[4], all_pending_issue_age[5],
                 count_resolution_info[0], count_resolution_info[1], count_resolution_info[2]
                 ]
    cursor.execute(query, arguments)
    cnx.commit()
    cursor.close()


def add_element_to_list(list, element):
     if element is not None:
        if type(element) == Decimal:
            list.append(float(element))
        else:
            list.append(element)


def collect_count_resolution_per_label(cnx, label_id):
    cursor = cnx.cursor()
    query = "SELECT num_merged, num_closed, num_pending FROM _label_count_resolution WHERE label_id = %s"
    arguments = [label_id]
    cursor.execute(query, arguments)

    result = cursor.fetchone()

    cursor.close()

    if not result:
        result = (None, None, None)

    return result


def calculate_statistics_per_label(cnx, label_id):
    cursor = cnx.cursor()
    query = "select li.repo_id, " \
            "li.label_id, li.label_name, " \
            "hs_first_comment, hs_collab_response, " \
            "imt.hs_to_solve as issue_merge_time_hs_to_solve, " \
            "ict.hs_to_solve as issue_close_time_hs_to_solve, " \
            "pia.issue_age as pending_issue_age " \
            "from _label_issues li " \
            "left outer join _issue_reaction_time irt on irt.issue_id = li.issue_id " \
            "left outer join _issue_merge_time imt on imt.issue_id = li.issue_id " \
            "left outer join _issue_close_time ict on ict.issue_id = li.issue_id " \
            "left outer join _pending_issue_age pia on pia.issue_id = li.issue_id " \
            "where label_id = %s"
    arguments = [label_id]
    cursor.execute(query, arguments)

    all_hs_first_comment = []
    all_hs_collab_response = []
    all_issue_merge_time_hs_to_solve = []
    all_issue_close_time_hs_to_solve = []
    all_pending_issue_age = []

    row = cursor.fetchone()

    if row is not None:
        repo_id = row[0]
        label_name = row[2]

        while row is not None:
            add_element_to_list(all_hs_first_comment, row[3])
            add_element_to_list(all_hs_collab_response, row[4])
            add_element_to_list(all_issue_merge_time_hs_to_solve, row[5])
            add_element_to_list(all_issue_close_time_hs_to_solve, row[6])
            add_element_to_list(all_pending_issue_age, row[7])
            row = cursor.fetchone()
        cursor.close()

        all_hs_first_comment_stats = calculate_statistics(all_hs_first_comment)
        all_hs_collab_response = calculate_statistics(all_hs_collab_response)
        all_issue_merge_time_hs_to_solve = calculate_statistics(all_issue_merge_time_hs_to_solve)
        all_issue_close_time_hs_to_solve = calculate_statistics(all_issue_close_time_hs_to_solve)
        all_pending_issue_age = calculate_statistics(all_pending_issue_age)

        count_resolution_info = collect_count_resolution_per_label(cnx, label_id)

        insert_in_db(cnx, repo_id, label_id, label_name,
                     all_hs_first_comment_stats,
                     all_hs_collab_response,
                     all_issue_merge_time_hs_to_solve,
                     all_issue_close_time_hs_to_solve,
                     all_pending_issue_age,
                     count_resolution_info)


def calculate_statistics(vector):
    if vector:
        mean = numpy.nanmean(vector)

        perc25th = numpy.percentile(vector, 25)
        perc50th = numpy.percentile(vector, 50)
        perc75th = numpy.percentile(vector, 75)

        IQR = perc75th - perc25th

        upperWhisker = perc75th + (IQR * 1.5)
        lowerWhisker = perc25th - (IQR * 1.5)

        stats = (round(lowerWhisker, 2),
                 round(perc25th, 2),
                 round(perc50th, 2),
                 round(perc75th, 2),
                 round(upperWhisker, 2),
                 round(mean, 2))
    else:
        stats = (None, None, None, None, None, None)

    return stats


def insert_statistics_for_labels(cnx):
    cursor = cnx.cursor()
    query = "SELECT label_id FROM _label_issues WHERE label_id > 0 GROUP BY label_id"
    cursor.execute(query)

    row = cursor.fetchone()
    while row is not None:
        label_id = row[0]
        calculate_statistics_per_label(cnx, label_id)
        row = cursor.fetchone()
    cursor.close()


def main():
    logging.basicConfig(filename=LOG_FILENAME, level=logging.WARNING)
    with open(LOG_FILENAME, "w") as log_file:
        log_file.write('\n')
    cnx = mysql.connector.connect(**CONFIG)
    create_table_label_statistics(cnx)
    insert_statistics_for_labels(cnx)
    cnx.close()

if __name__ == "__main__":
    main()
-- TABLE REMOVAL --

DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS employment_history;
DROP TABLE IF EXISTS perf_reviews;
DROP TABLE IF EXISTS employees;


-- TABLE CREATION --
CREATE TABLE departments(
    id INT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE employees(
    id int primary key, 
    fname varchar(50) NOT null,
    lname varchar(50) NOT null,
    dep_id int,
    pos varchar(50) NOT null,
    manager int,
    addr varchar(100),
    email varchar(100),
    phn_num varchar(50),
    rating int,
    strikes int,
    username varchar(20),
    password varchar(128),
    salt varchar(32),
    active varchar(10),
    confidential int, 
    UNIQUE KEY(username),
    FOREIGN KEY (dep_id) REFERENCES departments(id)
);

CREATE TABLE reports(
    id int not null AUTO_INCREMENT,
    by_emp_id int not null,
    for_emp_id int not null,
    report TEXT not null,
    creation_date VARCHAR(50) not null,
    status varchar(50) not null,
    close_reason varchar(100),
    severity int not null,
    comments TEXT,
    PRIMARY KEY (id),
    foreign key (by_emp_id) references employees(id),
    foreign key (for_emp_id) references employees(id)
);

CREATE TABLE perf_reviews(
    id int auto_increment,
    emp_id int not null,
    manager_id int not null,
    review TEXT not null,
    score int not null,
    creation_date VARCHAR(50) not null,
    active VARCHAR(10),
    primary key(id),
    foreign key (emp_id) references employees(id),
    foreign key (manager_id) references employees(id)
);

CREATE TABLE employment_history(
    id int not null,
    position varchar(50) not null,
    start_date varchar(50) not null,
    primary key (id, position, start_date),
    foreign key (id) references employees(id)
);

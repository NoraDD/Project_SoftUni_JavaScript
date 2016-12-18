function hbsHelpers(hbs) {
    hbs.create({
        helpers: { // This was missing
            "ifvalue": function (conditional, options) {
                if (options.hash.value === conditional) {
                    options.fn(this)
                } else {
                    options.inverse(this);
                }
            }

            // More helpers...
        }

    });
}

module.exports = hbsHelpers;